import { PartialType } from '@nestjs/swagger';
import { CreateVotedDto } from './create-voted.dto';

export class UpdateVotedDto extends PartialType(CreateVotedDto) {}
