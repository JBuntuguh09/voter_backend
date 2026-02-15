import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";

import { CandidateService } from "./candidates.service";
import { CanFilterDto, CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";

@Controller("candidates")
export class CandidateController {
  constructor(private readonly service: CandidateService) {}

  @Post()
  create(@Body() dto: CreateCandidateDto) {
    return this.service.create(dto);
  }

  /* ================= FIND ALL WITH FILTERS ================= */
  @Get()
  findAll(@Query() dto: CanFilterDto) {
    return this.service.findAll(dto);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCandidateDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
