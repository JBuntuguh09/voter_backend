import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VoteService } from './votes.service';
import { CreateVoteDto, VoteTallyDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';

@Controller('votes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VoteService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto, @CurrentUser() user: User) {
    return this.votesService.create(createVoteDto, user);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Get("tally")
  tallyVotes(@Query() dto: VoteTallyDto) {
    return this.votesService.tallyVotes(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
