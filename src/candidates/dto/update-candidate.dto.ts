import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCandidateDto } from './create-candidate.dto';
import { Optional } from '@nestjs/common';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
    
}
