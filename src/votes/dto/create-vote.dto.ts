import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVoteDto {
  @ApiProperty({
    description: "Position being voted for",
    example: "President",
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: "Vote value",
    example: "Yes",
    required: false,
  })
  @IsOptional()
  @IsString()
  vote?: string;

  @ApiProperty({
    description: "Candidate ID for this vote",
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  candidateId: number;

  @ApiProperty({
    description: "Organization ID where this vote belongs",
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  organizationId: number;

  @ApiProperty({
    description: "Who created this vote",
    example: "admin",
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateVoteDto {
  @ApiProperty({
    description: "Position being voted for",
    example: "Vice President",
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: "Vote value",
    example: "No",
    required: false,
  })
  @IsOptional()
  @IsString()
  vote?: string;

  @ApiProperty({
    description: "Candidate ID for this vote",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  candidateId?: number;

  @ApiProperty({
    description: "Organization ID where this vote belongs",
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @ApiProperty({
    description: "Who updated this vote",
    example: "admin",
    required: false,
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({
    description: "Status of vote",
    example: "Active",
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}


export class VoteTallyDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumberString()
  organizationId?: string;

  @ApiProperty({ required: false, example: "VICE PRESIDENT" })
  @IsOptional()
  @IsString()
  position?: string;
}
