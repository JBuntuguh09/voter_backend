import { Module } from '@nestjs/common';
import { CandidateService } from './candidates.service';
import { CandidateController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/auth/entities/user.entity';
import { Images } from 'src/images/entities/image.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Candidate, Organization, User, Images])
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
})
export class CandidatesModule {}
