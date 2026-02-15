import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { CreateRoleDto, CreateRoleDtoPerm } from "./dto/create-role.dto"
import { UpdateRoleDto } from "./dto/update-role.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorators";
import { User } from "src/auth/entities/user.entity";
import { JwtAuthGuard } from "src/common/gaurds/jwt-auth.guard";

@ApiTags("Roles")
@ApiBearerAuth('access-token')
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Standard create
  @Post()
  @ApiOperation({ summary: "Create a role" })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  // Create role with permissions
  
  @Post("with-permissions")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a role with permissions" })
  createWithPermissions(
    @Body() dto: CreateRoleDtoPerm,
    @CurrentUser() user: User,
  ) {
 
    return this.roleService.createWith(dto, user);
  }

  // List roles with pagination
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'assemblyId', required: false, type: Number })
  @ApiQuery({ name: 'regionId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'addCollectors', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('assemblyId') assemblyId?: number,
    @Query('regionId') regionId?: number,
    @Query('search') search?: string,
    @Query('addCollectors') addCollectors?: string,
  ) {
    
    return this.roleService.findAll(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
      assemblyId ? Number(assemblyId) : undefined,
      regionId ? Number(regionId) : undefined,
      search ,
      addCollectors
    )
  }


  // List all roles with permissions
  @Get("with-permissions")
  @ApiOperation({ summary: "Get all roles with permissions" })
  findAllWithPermissions() {
    return this.roleService.findAllWithPermissions();
  }

  // Get single role
  @Get(":id")
  @ApiOperation({ summary: "Get role by ID" })
  findOne(@Param("id") id: number) {
    return this.roleService.findOne(+id);
  }

  // Get role with permissions
  @Get(":id/with-permissions")
  @ApiOperation({ summary: "Get role with permissions by ID" })
  findOneWithPermissions(@Param("id") id: number) {
    return this.roleService.findOneWithPermissions(+id);
  }

  // Get permissions only
  // @Get(":id/permissions")
  // @ApiOperation({ summary: "Get permissions for a role" })
  // getPermissions(@Param("id") id: number) {
  //   return this.roleService.getPermissionsByRoleId(+id);
  // }

  // Standard update
  @Patch(":id")
  @ApiOperation({ summary: "Update role" })
  update(@Param("id") id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(+id, dto);
  }

  // Update role with permissions
  // @Patch(":id/with-permissions")
  // @ApiOperation({ summary: "Update role and permissions" })
  // updateWithPermissions(
  //   @Param("id") id: number,
  //   @Body() dto: UpdateRoleDto,
  // ) {
  //   const user = "system"; // replace with @CurrentUser()
  //   return this.roleService.updateWithPerm(+id, dto, user);
  // }

  // Delete role
  @Delete(":id")
  @ApiOperation({ summary: "Delete role" })
  remove(@Param("id") id: number) {
    return this.roleService.remove(+id);
  }
}
