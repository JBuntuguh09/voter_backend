import { Module } from '@nestjs/common';
import { VotedService } from './voted.service';
import { VotedController } from './voted.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Voted } from './entities/voted.entity';
import { User } from 'src/auth/entities/user.entity';
import { Vote } from 'src/votes/entities/vote.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([Candidate, Organization, Voted, User, Vote])
    ],
  controllers: [VotedController],
  providers: [VotedService],
  exports: [VotedService],
})
export class VotedModule {}
