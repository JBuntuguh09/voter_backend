import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto, CreateRoleDtoPerm } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
// import { PermissionsList } from 'src/permissions-list/entities/permissions-list.entity';
// import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
   
    // @InjectRepository(PermissionsList)
    // private permissionRepo: Repository<PermissionsList>,

    // @InjectRepository(Permission)
    // private permRepo: Repository<Permission>,
   
  ) {}

  async create(dto: CreateRoleDto) {
    if(dto.name === "Collector"){
      throw new  BadRequestException("Collectors already exists")
    }
     const eRole = await this.roleRepo.findOne({
      where:{name:dto.name,
        organization:{id:dto.assemblyId},
        
       // status:'Active'
      },
      
      
    })
    if(eRole){
     
      throw new BadRequestException(`${dto.name} role already exists`)
    }

    const org = await this.orgRepo.findOne({
      where: { id: dto.assemblyId },
    });

    if (!org) {
      throw new NotFoundException('Assembly not found');
    }

    const role = this.roleRepo.create({
      ...dto,
      organization: org,
    });

    return this.roleRepo.save(role);
  }

  async findAll(
  page?: number,
  limit?: number,
  assemblyId?: number,
  regionId?: number,
  search?: string,
  addCollectors: string = "No",
) {
  const exclude = "Collector"
  const query = this.roleRepo
    .createQueryBuilder('role')
    .leftJoinAndSelect('role.assembly', 'assembly')
   // .leftJoinAndSelect('role.permission', 'permission')

  /* ================= FILTERS ================= */
  if (assemblyId) {
    query.andWhere('assembly.id = :assemblyId', { assemblyId });
  }

  if (regionId) {
    query.andWhere('assembly.regionId = :regionId', { regionId });
  }
  
  if(addCollectors === "No"){
   
    query.andWhere('(role.isCollector = :No)', {No: "No"})
  }
  if(addCollectors === "Only"){
    query.andWhere('(role.isCollector = :Yes)', {Yes: "Yes"})
  }


  if(search){
    
    query.andWhere("(role.name ILIKE :search)", { search: `%${search}%` })
  }

  query.orderBy('role.id', 'DESC');

  /* ================= PAGINATION (OPTIONAL) ================= */
  if (page && limit) {
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);
  }

  const [data, total] = await query.getManyAndCount();

  /* ================= RESPONSE ================= */
  return {
    meta: page && limit
      ? {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      : null, // no pagination → return everything
    data,
  };
}



  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['assembly', 'permission'],
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');

    if (dto.assemblyId) {
      const org = await this.orgRepo.findOne({
        where: { id: dto.assemblyId },
      });

      if (!org) {
        throw new NotFoundException('Assembly not found');
      }

      role.organization = org;
    }
    

    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    return this.roleRepo.remove(role);
  }

  async createWith(dto: CreateRoleDtoPerm, user: User) {
    const eRole = await this.roleRepo.findOne({
      where:{name:dto.name,
        organization:{id:dto.assemblyId},
       // status:'Active'
      },
      
      
    })
    if(eRole){
      
      throw new BadRequestException(`${dto.name} role already exists`)
    }

   const role = await this.roleRepo.save({
      name: dto.name,
      description: dto.description,
      assembly: { id: dto.assemblyId },
      isCollector: dto.isCollector,
      createdBy: user?.username+"-"+user?.id,
    });


   if (dto.permissions && dto.permissions.length > 0) {
    
    //  const perms = await this.permissionRepo.find({
    //    where: { id: In(dto.permissions) },
    //  });
    //  for(let a=0; a<perms.length; a++){
    //   await this.permRepo.insert({
    //     ...perms[a],
    //     permissionListId:perms[a].id,
    //     componentName:perms[a].componentName,
    //     componentPath:perms[a].componentPath,
    //     componentType:perms[a].componentType,
    //     crudType:perms[a].crudType,
    //     name:perms[a].name,
    //     status:perms[a].status,
    //     description:perms[a].description,
    //     role:{id: role.id}
    //   })
    // }
     // attach the found permissions to the role and save
    //  role.permission = perms;
    //  await this.roleRepo.save(role);
   }

    return role;
  }

  async findAllWithPermissions() {
    return this.roleRepo.find({ relations: ["permission", "assembly"] });
  }

  async findOneWithPermissions(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ["permission", "assembly"],
    });
    if (!role) throw new NotFoundException("Role not found");
    return role;
  }

  // async getPermissionsByRoleId(roleId: number) {
  //   const role = await this.findOne(roleId);
  //   return role.permission;
  // }

  // async updateWithPerm(id: number, dto: UpdateRoleDto, user: string) {
  //   const role = await this.findOne(id);

  //   if (dto.permission) {
  //     role.permission = await this.permRepo.find({
  //       where: { name: In(dto.permission) },
  //     });
  //   }

  //   role.name = dto.name ?? role.name;
  //   role.description = dto.description ?? role.description;
  //   role.updatedBy = user;

  //   return this.roleRepo.save(role);
  // }

  
}
