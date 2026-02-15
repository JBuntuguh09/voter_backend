import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Person } from 'src/person/entities/person.entity';
import { Role } from 'src/role/entities/role.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Organization, Person, Role, Message])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
