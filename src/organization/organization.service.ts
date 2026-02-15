import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  // CREATE
  async create(dto: CreateOrganizationDto) {
    const org = this.organizationRepo.create(dto);
    return await this.organizationRepo.save(org);
  }

  // FIND ALL (pagination-ready)
  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.organizationRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdDatetime: "DESC" },
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }

  // FIND ONE
  async findOne(id: number) {
    const org = await this.organizationRepo.findOne({
      where: { id },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return org;
  }

  // UPDATE
  async update(id: number, dto: UpdateOrganizationDto) {
    const org = await this.findOne(id);

    Object.assign(org, dto);
    return await this.organizationRepo.save(org);
  }

  // SOFT DELETE STYLE (recommended)
  async remove(id: number) {
    const org = await this.findOne(id);

    org.status = "Deleted";
    return await this.organizationRepo.save(org);
  }

  // HARD DELETE (optional)
  async hardDelete(id: number) {
    await this.organizationRepo.delete(id);
    return { message: "Deleted successfully" };
  }
}
