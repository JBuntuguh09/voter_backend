import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, UseGuards, Query } from "@nestjs/common";
import { VotedService } from "./voted.service";
import { CreateVotedDto, UpdateVotedDto, VotedFilterDto } from "./dto/create-voted.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/gaurds/jwt-auth.guard";

@Controller("voted")
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class VotedController {
  constructor(private readonly votedService: VotedService) {}

  // ---- CREATE ----
  @Post()
  create(@Body() createDto: CreateVotedDto) {
    return this.votedService.create(createDto);
  }

  // ---- GET ALL ----
  @Get()
  findAll(@Query() dto: VotedFilterDto) {
    return this.votedService.findAll(dto);
  }

  // ---- GET ONE ----
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.votedService.findOne(id);
  }

  // ---- UPDATE ----
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateVotedDto) {
    return this.votedService.update(id, updateDto);
  }

  // ---- DELETE ----
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.votedService.remove(id);
  }
}
