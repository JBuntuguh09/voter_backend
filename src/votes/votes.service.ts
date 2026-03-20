import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vote } from "./entities/vote.entity";
import { Candidate } from "src/candidates/entities/candidate.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { CreateVoteDto, UpdateVoteDto, VoteTallyDto } from "./dto/create-vote.dto";
import { VotedService } from "src/voted/voted.service";
import { User } from "src/auth/entities/user.entity";
import PDFDocument from "pdfkit";
import axios from "axios";

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Candidate) private candidateRepo: Repository<Candidate>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
    private readonly votedService: VotedService
  ) {}

  // ---- CREATE ----
  async create(createDto: CreateVoteDto, user: User): Promise<Vote> {
    const candidate = await this.candidateRepo.findOneBy({ id: createDto.candidateId });
    const organization = await this.orgRepo.findOneBy({ id: (createDto.organizationId) });

    if (!candidate) throw new NotFoundException("Candidate not found");
    if (!organization) throw new NotFoundException("Organization not found");

    const vote = this.voteRepo.create({
      position: createDto.position,
      vote: createDto.vote || "Yes",
      candidate,
      organization,
      status: "Active",
      createdBy: createDto.createdBy || "Admin",
    });

    await this.votedService.create({
      position: createDto.position,
      organizationId: organization.id,
      userId: user.id,
    })

    return this.voteRepo.save(vote);
  }

  // ---- FIND ALL ----
  async findAll(): Promise<Vote[]> {
    return this.voteRepo.find({
      relations: ["candidate", "organization"],
    });
  }

  // ---- FIND ONE ----
  async findOne(id: number): Promise<Vote> {
    const vote = await this.voteRepo.findOne({
      where: { id },
      relations: ["candidate", "organization"],
    });
    if (!vote) throw new NotFoundException("Vote not found");
    return vote;
  }

  // ---- UPDATE ----
  async update(id: number, updateDto: UpdateVoteDto): Promise<Vote> {
    const vote = await this.findOne(id);

    if (updateDto.candidateId) {
      const candidate = await this.candidateRepo.findOneBy({ id: updateDto.candidateId });
      if (!candidate) throw new NotFoundException("Candidate not found");
      vote.candidate = candidate;
    }

    if (updateDto.organizationId) {
      const org = await this.orgRepo.findOneBy({ id: (updateDto.organizationId) });
      if (!org) throw new NotFoundException("Organization not found");
      vote.organization = org;
    }

    vote.position = updateDto.position ?? vote.position;
    vote.vote = updateDto.vote ?? vote.vote;
    vote.status = updateDto.status ?? vote.status;
    vote.updatedBy = updateDto.updatedBy ?? vote.updatedBy;

    return this.voteRepo.save(vote);
  }

  // ---- DELETE ----
  async remove(id: number): Promise<{ message: string }> {
    const vote = await this.findOne(id);
    await this.voteRepo.remove(vote);
    return { message: "Vote deleted successfully" };
  }

  async tallyVotes(dto: VoteTallyDto) {
  const qb = this.candidateRepo
    .createQueryBuilder("candidate")

    // ✅ JOIN votes (keep zero votes)
    .leftJoin(
      "candidate.vote",
      "vote",
      "vote.status = :status AND vote.vote = :yes",
      {
        status: "Active",
        yes: "Yes",
      },
    )

    // ✅ JOIN organization
    .leftJoin("candidate.organization", "organization")

    // ✅ JOIN image
    .leftJoin("candidate.image", "image")

    // ================= SELECT =================
    .select("candidate.id", "candidateId")
    .addSelect("candidate.firstName", "firstName")
    .addSelect("candidate.lastName", "lastName")
    .addSelect("candidate.position", "position")

    // ✅ IMAGE FIELDS
    .addSelect("image.url", "imageUrl")
    .addSelect("image.base64", "imageBase64")

    // COUNT votes (including zero)
    .addSelect("COUNT(vote.id)", "totalVotes")

    // ================= GROUP BY =================
    .groupBy("candidate.id")
    .addGroupBy("candidate.firstName")
    .addGroupBy("candidate.lastName")
    .addGroupBy("candidate.position")

    // ✅ GROUP image fields (VERY IMPORTANT)
    .addGroupBy("image.url")
    .addGroupBy("image.base64")

    .orderBy("COUNT(vote.id)", "DESC");

  /* ========= OPTIONAL FILTERS ========= */

  if (dto.organizationId) {
    qb.andWhere("organization.id = :organizationId", {
      organizationId: Number(dto.organizationId),
    });
  }

  if (dto.position) {
    qb.andWhere("LOWER(candidate.position) = LOWER(:position)", {
      position: dto.position,
    });
  }

  qb.andWhere("candidate.status = :cStatus", {
    cStatus: "Active",
  });

  const rows = await qb.getRawMany();

  // ================= RESPONSE =================
  return rows.map((r) => ({
    candidateId: Number(r.candidateId),
    fullName: `${r.firstName} ${r.lastName}`,
    position: r.position,
    totalVotes: Number(r.totalVotes),

    // ✅ IMAGE RETURN
    imageUrl: r.imageUrl || null,
    imageBase64: r.imageBase64 || null,
  }));
}


  async getWinnersByPosition(organizationId?: number) {
    const query = this.voteRepo
      .createQueryBuilder("vote")
      .leftJoin("vote.candidate", "candidate")
      .leftJoin("vote.organization", "organization")
      .leftJoin("candidate.image", "image")
      .select("candidate.position", "position")
      .addSelect("candidate.id", "candidateId")
      .addSelect("candidate.firstName", "firstName")
      .addSelect("candidate.lastName", "lastName")
      .addSelect("candidate.code", "code")
      .addSelect("COUNT(vote.id)", "voteCount")
      .addSelect("image.url", "imageUrl")
.addSelect("image.base64", "imageBase64") // optional
      .where("vote.status = :voteStatus", { voteStatus: "Active" })
      .andWhere("candidate.status = :candidateStatus", {
        candidateStatus: "Active",
      })
      .andWhere("vote.vote = :voteValue", { voteValue: "Yes" })
      .groupBy("candidate.position")
      .addGroupBy("candidate.id")
      .addGroupBy("candidate.firstName")
      .addGroupBy("candidate.lastName")
      .addGroupBy("candidate.code")
      .addGroupBy("image.url")
.addGroupBy("image.base64")
      .orderBy("candidate.position", "ASC")
      .addOrderBy(`COUNT(vote.id)`, "DESC")

    if (organizationId) {
      query.andWhere("organization.id = :organizationId", { organizationId });
    }

    const results = await query.getRawMany();

    type CandidateSummary = {
      candidateId: number;
      code: string;
      firstName: string;
      lastName: string;
      candidateName: string;
      voteCount: number;
      imageUrl?: string | null;
      imageBase64?: string | null;
    };

    const grouped = results.reduce((acc, row) => {
      const position = row.position ?? "Unknown";

      if (!acc[position]) {
        acc[position] = [];
      }

      acc[position].push({
        candidateId: Number(row.candidateId),
        code: row.code,
        firstName: row.firstName,
        lastName: row.lastName,
        candidateName: `${row.firstName} ${row.lastName}`,
        voteCount: Number(row.voteCount),
  imageUrl: row.imageUrl ?? null, // ✅ NEW
  imageBase64: row.imageBase64 ?? null
      } as CandidateSummary);

      return acc;
    }, {} as Record<string, CandidateSummary[]>);

    const finalData = (Object.entries(grouped) as Array<
      [string, CandidateSummary[]]
    >).map(([position, candidates]) => {
      const highestVoteCount = Math.max(
        ...candidates.map((candidate) => candidate.voteCount)
      );

      const topCandidates = candidates.filter(
        (candidate) => candidate.voteCount === highestVoteCount
      );

      const resultType = topCandidates.length > 1 ? "Draw" : "Winner";

      return {
        position,
        resultType,
        winners: topCandidates.map((candidate) => ({
          ...candidate,
          status: resultType,
        })),
      };
    });

    return {
      message: "Position winners fetched successfully",
      data: finalData,
    };
  }

  async getFullRanking(organizationId?: number) {
  const qb = this.candidateRepo
    .createQueryBuilder("candidate")
    .leftJoin(
      "candidate.vote",
      "vote",
      "vote.status = :status AND vote.vote = :yes",
      {
        status: "Active",
        yes: "Yes",
      },
    )
    .leftJoin("candidate.organization", "organization")
    .leftJoin("candidate.image", "image")

    .select("candidate.position", "position")
    .addSelect("candidate.id", "candidateId")
    .addSelect("candidate.firstName", "firstName")
    .addSelect("candidate.lastName", "lastName")
    .addSelect("image.url", "imageUrl")
    .addSelect("image.base64", "imageBase64")

    .addSelect("COUNT(vote.id)", "totalVotes")

    .where("candidate.status = :status", { status: "Active" })

    .groupBy("candidate.id")
    .addGroupBy("candidate.firstName")
    .addGroupBy("candidate.lastName")
    .addGroupBy("candidate.position")
    .addGroupBy("image.url")
    .addGroupBy("image.base64")

    .orderBy("candidate.position", "ASC")
    .addOrderBy("COUNT(vote.id)", "DESC");

  if (organizationId) {
    qb.andWhere("organization.id = :organizationId", { organizationId });
  }

  const rows = await qb.getRawMany();

  // GROUP + RANK
  type CandidateRanking = {
    candidateId: number;
    name: string;
    votes: number;
    imageBase64?: string | null;
    imageUrl?: string | null;
  };

  const grouped = rows.reduce((acc, row) => {
    const pos = row.position;

    if (!acc[pos]) acc[pos] = [];

    acc[pos].push({
      candidateId: Number(row.candidateId),
      name: `${row.firstName} ${row.lastName}`,
      votes: Number(row.totalVotes),
      imageBase64: row.imageBase64,
      imageUrl: row.imageUrl,
    } as CandidateRanking);

    return acc;
  }, {} as Record<string, CandidateRanking[]>);

  return (Object.entries(grouped) as Array<[string, CandidateRanking[]]>).map(([position, candidates]) => {
    const maxVotes = Math.max(...candidates.map(c => c.votes));

    return {
      position,
      candidates: candidates.map((c, index) => ({
        ...c,
        rank: index + 1,
        isWinner: c.votes === maxVotes,
      })),
    };
  });
}

 async generateRankingPdf(data: any[]): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageWidth = doc.page.width;

      /* ================= HEADER ================= */
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("ELECTION RESULTS REPORT", {
          align: "center",
        });

      doc.moveDown(0.3);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("gray")
        .text(`Generated on: ${new Date().toLocaleString()}`, {
          align: "center",
        })
        .fillColor("black");

      doc.moveDown(1);

      // Divider
      doc
        .moveTo(50, doc.y)
        .lineTo(pageWidth - 50, doc.y)
        .stroke();

      doc.moveDown(1.5);

      /* ================= LOOP POSITIONS ================= */
      for (const position of data) {
        /* ===== POSITION TITLE ===== */
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#1a1a1a")
          .text(position.position.toUpperCase());

        doc.moveDown(0.5);

        // underline
        doc
          .moveTo(50, doc.y)
          .lineTo(pageWidth - 50, doc.y)
          .stroke();

        doc.moveDown(0.8);

        /* ===== TABLE HEADER ===== */
        const startY = doc.y;

        doc.font("Helvetica-Bold").fontSize(10);

        doc.text("Rank", 50, startY);
        doc.text("Candidate", 110, startY);
        doc.text("Votes", 350, startY);
        doc.text("Status", 420, startY);

        // header line
        doc
          .moveTo(50, startY + 15)
          .lineTo(pageWidth - 50, startY + 15)
          .stroke();

        let y = startY + 25;

        const maxVotes = Math.max(
          ...position.candidates.map((c: any) => c.votes),
        );

        /* ===== ROWS ===== */
        for (const candidate of position.candidates) {
          const isWinner = candidate.votes === maxVotes;

          // alternating row background
          if (candidate.rank % 2 === 0) {
            doc
              .rect(50, y - 5, pageWidth - 100, 30)
              .fillOpacity(0.05)
              .fill("#000")
              .fillOpacity(1);
          }

          /* ===== RANK ===== */
          doc.font("Helvetica").fillColor("black").text(candidate.rank, 50, y);

          /* ===== IMAGE ===== */
          try {
            if (candidate.imageBase64) {
              const base64Data = candidate.imageBase64.split(",").pop();
              const imgBuffer = Buffer.from(base64Data, "base64");

              doc.image(imgBuffer, 75, y - 5, {
                width: 25,
                height: 25,
              });
            } else if (candidate.imageUrl) {
              const response = await axios.get(candidate.imageUrl, {
                responseType: "arraybuffer",
              });

              doc.image(Buffer.from(response.data), 75, y - 5, {
                width: 25,
                height: 25,
              });
            }
          } catch {
            doc.circle(88, y + 8, 8).stroke();
          }

          /* ===== NAME ===== */
          doc
            .font("Helvetica")
            .text(candidate.name, 110, y, { width: 220 });

          /* ===== VOTES ===== */
          doc.text(candidate.votes.toString(), 350, y);

          /* ===== STATUS ===== */
          if (isWinner) {
            doc
              .fillColor("green")
              .font("Helvetica-Bold")
              .text("WINNER", 420, y)
              .fillColor("black");
          } else {
            doc
              .fillColor("gray")
              .text("-", 420, y)
              .fillColor("black");
          }

          y += 35;

          /* ===== PAGE BREAK ===== */
          if (y > 750) {
            doc.addPage();
            y = 50;
          }
        }

        doc.moveDown(1.5);

        /* ===== DRAW NOTICE ===== */
        const winners = position.candidates.filter(
          (c: any) => c.votes === maxVotes,
        );

        if (winners.length > 1) {
          doc
            .fillColor("orange")
            .font("Helvetica-Bold")
            .text("⚖ DRAW: Multiple candidates have highest votes")
            .fillColor("black");

          doc.moveDown(1);
        }

        doc.addPage();
      }

      /* ================= FOOTER ================= */
      const range = doc.bufferedPageRange();

      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        doc
          .fontSize(9)
          .fillColor("gray")
          .text(
            `Page ${i + 1} of ${range.count}`,
            0,
            doc.page.height - 50,
            { align: "center" },
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
}
