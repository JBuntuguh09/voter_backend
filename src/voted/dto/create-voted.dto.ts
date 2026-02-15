// DTOs for creating/updating voted records
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString } from "class-validator";

export class CreateVotedDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  organizationId: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateVotedDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}



export class VotedFilterDto {

  @ApiProperty({
    required: false,
    example: 1,
    description: "Filter by organization ID",
  })
  @IsOptional()
  @IsNumberString()
  organizationId?: string;

  @ApiProperty({
    required: false,
    example: "President",
    description: "Filter by position",
  })
  @IsOptional()
  @IsString()
  position?: string;

  
}
