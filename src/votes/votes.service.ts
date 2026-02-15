import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vote } from "./entities/vote.entity";
import { Candidate } from "src/candidates/entities/candidate.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { CreateVoteDto, UpdateVoteDto, VoteTallyDto } from "./dto/create-vote.dto";
import { VotedService } from "src/voted/voted.service";
import { User } from "src/auth/entities/user.entity";

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

    // LEFT JOIN votes so zero-vote candidates remain
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

    .select("candidate.id", "candidateId")
    .addSelect("candidate.firstName", "firstName")
    .addSelect("candidate.lastName", "lastName")
    .addSelect("candidate.position", "position")

    // COUNT votes (0 included)
    .addSelect("COUNT(vote.id)", "totalVotes")

    .groupBy("candidate.id")
    .addGroupBy("candidate.firstName")
    .addGroupBy("candidate.lastName")
    .addGroupBy("candidate.position")

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

  // optional: active candidates only
  qb.andWhere("candidate.status = :cStatus", {
    cStatus: "Active",
  });

  const rows = await qb.getRawMany();

  return rows.map((r) => ({
    candidateId: Number(r.candidateId),
    fullName: `${r.firstName} ${r.lastName}`,
    position: r.position,
    totalVotes: Number(r.totalVotes), // now includes ZERO
  }));
}

}
