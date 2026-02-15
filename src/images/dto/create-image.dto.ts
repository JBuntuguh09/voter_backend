import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateImageDto {
  @ApiProperty({ example: "https://res.cloudinary.com/image.png" })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ example: "data:image/png;base64,..." })
  @IsOptional()
  @IsString()
  base64?: string;

  @ApiProperty({ example: "cloudinary_public_id_123" })
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @ApiProperty({ example: "Active", default: "Active" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: "admin" })
  @IsOptional()
  @IsString()
  createdBy?: string;
}


export class UpdateImagesDto extends PartialType(CreateImageDto){}