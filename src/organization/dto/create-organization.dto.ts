import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  Matches,
} from "class-validator";

export class CreateOrganizationDto {

  @ApiProperty({
    example: "IMMILAC Aflao",
    description: "Organization name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @ApiPropertyOptional({
    example: "IMMILAC Aflao membership",
  })
  @IsOptional()
  @IsString()
  description?: string;

  /* ================= ELECTION DATES ================= */

  @ApiPropertyOptional({
    example: "2026-02-20T00:00:00.000Z",
    description: "Election start date",
  })
  @IsOptional()
  @IsDateString()
  electionStartDate?: string;

  @ApiPropertyOptional({
    example: "08:00",
    description: "Election start time (HH:mm)",
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "electionStartTime must be in HH:mm format",
  })
  electionStartTime?: string;

  @ApiPropertyOptional({
    example: "2026-02-25T00:00:00.000Z",
    description: "Election end date",
  })
  @IsOptional()
  @IsDateString()
  electionEndDate?: string;

  @ApiPropertyOptional({
    example: "18:00",
    description: "Election end time (HH:mm)",
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "electionEndTime must be in HH:mm format",
  })
  electionEndTime?: string;

  /* ================= META ================= */

  @ApiPropertyOptional({ example: "Active" })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  status?: string;

  @ApiPropertyOptional({ example: "Admin" })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  createdBy?: string;
}
