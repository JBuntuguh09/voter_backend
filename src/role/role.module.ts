import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Role, User, Organization])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
