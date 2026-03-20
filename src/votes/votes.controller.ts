import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, Res } from '@nestjs/common';
import { VoteService } from './votes.service';
import { CreateVoteDto, VoteTallyDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';
import type { Response } from 'express';



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

  @Get("winners/:organizationId")
  async getWinnersByPosition(
    @Param("organizationId", ParseIntPipe) organizationId: number
  ) {
    return this.votesService.getWinnersByPosition(organizationId);
  }

  @Get("ranking/pdf/:organizationId")
async downloadRankingPdf(
  @Param("organizationId") orgId: number,
  @Res() res: Response,
) {
  const data = await this.votesService.getFullRanking(orgId);

  const pdfBuffer = await this.votesService.generateRankingPdf(data);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=full-election-results.pdf",
  });

  res.end(pdfBuffer);
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
