import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Voted } from "./entities/voted.entity";
import { CreateVotedDto, UpdateVotedDto, VotedFilterDto } from "./dto/create-voted.dto";
import { User } from "src/auth/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";

@Injectable()
export class VotedService {
  constructor(
    @InjectRepository(Voted)
    private votedRepo: Repository<Voted>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  // ---- CREATE ----
  async create(createDto: CreateVotedDto): Promise<Voted> {
    const user = await this.userRepo.findOneBy({ id: createDto.userId });
    const organization = await this.orgRepo.findOneBy({ id: createDto.organizationId });

    if (!user) throw new NotFoundException("User not found");
    if (!organization) throw new NotFoundException("Organization not found");

    const voted = this.votedRepo.create({
      position: createDto.position,
      user,
      organization,
      status: createDto.status || "Active",
      createdBy: createDto.createdBy || "Admin",
    });

    return this.votedRepo.save(voted);
  }

  // ---- FIND ALL ----
  async findAll(dto: VotedFilterDto){
     const qb = this.votedRepo
    .createQueryBuilder("voted")
        .leftJoinAndSelect("voted.organization", "organization")

    
    .orderBy("voted.createdDatetime", "DESC");

  /* ================= ORGANIZATION FILTER ================= */
  if (dto.organizationId) {
    qb.andWhere("organization.id = :organizationId", {
      organizationId: Number(dto.organizationId),
    });
  }

  /* ================= POSITION FILTER ================= */
  if (dto.position) {
    qb.andWhere("LOWER(voted.position) = LOWER(:position)", {
      position: dto.position,
    });
  }

  /* ================= SEARCH FILTER ================= */
  

  /* ================= ONLY ACTIVE ================= */
  qb.andWhere("voted.status = :status", {
    status: "Active",
  });

  const data = await qb.getMany();

  return {
    total: data.length,
    data,
  };
  }

  // ---- FIND ONE ----
  async findOne(id: number): Promise<Voted> {
    const voted = await this.votedRepo.findOne({
      where: { id },
      relations: ["user", "organization"],
    });
    if (!voted) throw new NotFoundException("Voted record not found");
    return voted;
  }

  // ---- UPDATE ----
  async update(id: number, updateDto: UpdateVotedDto): Promise<Voted> {
    const voted = await this.findOne(id);

    if (updateDto.userId) {
      const user = await this.userRepo.findOneBy({ id: updateDto.userId });
      if (!user) throw new NotFoundException("User not found");
      voted.user = user;
    }

    if (updateDto.organizationId) {
      const organization = await this.orgRepo.findOneBy({ id: updateDto.organizationId });
      if (!organization) throw new NotFoundException("Organization not found");
      voted.organization = organization;
    }

    voted.position = updateDto.position ?? voted.position;
    voted.status = updateDto.status ?? voted.status;
    voted.updatedBy = updateDto.updatedBy ?? voted.updatedBy;

    return this.votedRepo.save(voted);
  }

  // ---- DELETE ----
  async remove(id: number): Promise<{ message: string }> {
    const voted = await this.findOne(id);
    await this.votedRepo.remove(voted);
    return { message: "Voted record deleted successfully" };
  }
}
