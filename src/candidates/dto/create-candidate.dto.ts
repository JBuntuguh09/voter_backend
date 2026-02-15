import {
  IsOptional,
  IsString,
  IsEmail,
  MaxLength,
  IsNumber,
  IsNumberString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCandidateDto {
  @ApiProperty({ example: "CAND-001", required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: "john@email.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "0240000000", required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: "President", required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  imageId?: number;

  @ApiProperty({ example: "admin", required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}


export class CanFilterDto {

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

  @ApiProperty({
    required: false,
    example: "john",
    description: "Search by name, code, email or phone",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
