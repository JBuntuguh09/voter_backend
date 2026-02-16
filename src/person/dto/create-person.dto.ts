import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({ example: 'John', description: 'First name of the person' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the person' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+233245678901', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 15)
  phoneNumber?: string;


  @ApiProperty({ example: 2, description: 'Organization ID reference' })
  @IsOptional()
  organizationId?: number;

  @ApiProperty({ example: 2, description: 'Region ID reference' })
  @IsOptional()
  regionId?: number;

  @ApiProperty({ example: 3, description: 'Image ID reference' })
  @IsOptional()
  imageId?: number;

  @ApiProperty({ example: 'Active', description: 'Status of the person', default: 'Active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

@ApiProperty({   example: 'Admin', required: false })
    @IsOptional()
    @IsString()
    createdBy?: string;

    @ApiProperty({ example: 'Admin', required: false })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
export class UpdatePersonDto extends PartialType(CreatePersonDto) {}


export class InsertBulkDTO{
  @ApiProperty({ example: 'JACK' })
  @IsString()
  FIRSTNAME: string;
 
  @ApiProperty({ example: 'DOE' })
  @IsString()
  LASTNAME: string;
  
  @ApiProperty({ example: 'DSI' })
  @IsString()
  RANK: string;
  
  @ApiProperty({ example: '0542555678' })
  @IsString()
  CONTACT: string;

  @ApiProperty({ example: '027727277' })
  @IsString()
  CONTACT_2: string;
  
  @ApiProperty({ example: 'FEMALE' })
  @IsString()
  GENDER: string;

  


}