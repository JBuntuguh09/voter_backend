import { Module } from '@nestjs/common';
import { VoteService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/auth/entities/user.entity';
import { Vote } from './entities/vote.entity';
import { Voted } from 'src/voted/entities/voted.entity';
import { VotedModule } from 'src/voted/voted.module';

@Module({
  imports:[
      TypeOrmModule.forFeature([Candidate, Organization, User, Vote, Voted]),
      VotedModule
    ],
    
  controllers: [VotesController],
  providers: [VoteService],
  exports: [VoteService]
})
export class VotesModule {}
