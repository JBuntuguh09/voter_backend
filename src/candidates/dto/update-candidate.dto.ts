import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCandidateDto } from './create-candidate.dto';
import { Optional } from '@nestjs/common';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
    @ApiPropertyOptional({ description: 'Base64 encoded image string', example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' })
    @Optional()
    base64Image?: string;
}
