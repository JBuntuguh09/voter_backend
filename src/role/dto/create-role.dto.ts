import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  assemblyId: number;

  @ApiPropertyOptional({ example: "No", description: "Is this role a collector role?" })
  @IsString()
  isCollector: string = "No";

  @IsString()
  @IsOptional()
  createdBy?: string;
}



export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiPropertyOptional({ example: ["Update Property"], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permission?: string[];
}


export class CreateRoleDtoPerm {
  @ApiProperty({ example: "Admin", description: "Role name" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "Administrator role with full permissions" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 9, description: "Assembly ID" })
  @IsNumber()
  assemblyId: number;

  @ApiPropertyOptional({ example: "No", description: "Is this role a collector role?" })
  @IsString()
  isCollector: string = "No";

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permissions?: number[];
}