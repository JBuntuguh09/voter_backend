import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Candidate } from "./entities/candidate.entity";
import { CanFilterDto, CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";

import { User } from "src/auth/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Images } from "src/images/entities/image.entity";

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,

    @InjectRepository(Images)
    private imageRepo: Repository<Images>,
  ) {}

  // CREATE
  async create(dto: CreateCandidateDto) {
    const candidate = this.candidateRepo.create(dto);

    if (dto.userId) {
      const user = await this.userRepo.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException("User not found");
      candidate.user = user;
    }

    if (dto.organizationId) {
      const org = await this.orgRepo.findOneBy({
        id: dto.organizationId,
      });
      if (!org) throw new NotFoundException("Organization not found");
      candidate.organization = org;
    }

    if (dto.imageId) {
      const image = await this.imageRepo.findOneBy({ id: dto.imageId });
      if (!image) throw new NotFoundException("Image not found");
      candidate.image = image;
    }

    return this.candidateRepo.save(candidate);
  }

  // FIND ALL
  async findAll(dto: CanFilterDto) {
  const qb = this.candidateRepo
    .createQueryBuilder("can")
    .leftJoinAndSelect("can.user", "user")
    .leftJoinAndSelect("can.organization", "organization")
    .leftJoinAndSelect("can.image", "image")
    .leftJoinAndSelect("can.vote", "vote")
    .orderBy("can.createdDatetime", "DESC");

  /* ================= ORGANIZATION FILTER ================= */
  if (dto.organizationId) {
    qb.andWhere("organization.id = :organizationId", {
      organizationId: Number(dto.organizationId),
    });
  }

  /* ================= POSITION FILTER ================= */
  if (dto.position) {
    qb.andWhere("LOWER(can.position) = LOWER(:position)", {
      position: dto.position,
    });
  }

  /* ================= SEARCH FILTER ================= */
  if (dto.search) {
    qb.andWhere(
      `(
        LOWER(can.firstName) LIKE LOWER(:search)
        OR LOWER(can.lastName) LIKE LOWER(:search)
        OR LOWER(can.code) LIKE LOWER(:search)
        OR LOWER(can.email) LIKE LOWER(:search)
        OR LOWER(can.phoneNumber) LIKE LOWER(:search)
      )`,
      { search: `%${dto.search}%` },
    );
  }

  /* ================= ONLY ACTIVE ================= */
  qb.andWhere("can.status = :status", {
    status: "Active",
  });

  const data = await qb.getMany();

  return {
    total: data.length,
    data,
  };
}


  // FIND ONE
  async findOne(id: number) {
    const candidate = await this.candidateRepo.findOne({
      where: { id },
      relations: ["user", "organization", "image", "vote"],
    });

    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }

    return candidate;
  }

  // UPDATE
  async update(id: number, dto: UpdateCandidateDto) {
    const candidate = await this.findOne(id);

    Object.assign(candidate, dto);

    return this.candidateRepo.save(candidate);
  }

  // SOFT DELETE
  async remove(id: number) {
    const candidate = await this.findOne(id);

    candidate.status = "Deleted";

    return this.candidateRepo.save(candidate);
  }
}
