import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([
    Person, Organization
   ])],
  controllers: [PersonController],
  providers: [PersonService],
  exports:[PersonService]
})
export class PersonModule {}
