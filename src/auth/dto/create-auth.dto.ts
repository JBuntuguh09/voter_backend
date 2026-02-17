export class CreateAuthDto {}
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';


export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Admin', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}




export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class RegisterDto extends CreatePersonDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;


  @ApiProperty({example:1})
  @IsOptional()
  @IsInt()
  roleId: number
  

  @ApiPropertyOptional({example:1})
  @IsOptional()
  @IsInt()
  personId: number;

  
}

export class LoginDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}


export class UpdateUserRegisterDto extends PartialType(RegisterDto) {
   @IsOptional()
   currentPassword?: string;
   @IsOptional()
  newPassword?: string;
}



export class GetUsersDto {
  @ApiPropertyOptional({example:1})
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({example:10})
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({example:9})
  @IsOptional()
  @IsNumberString()
  assemblyId?: string;

  @ApiPropertyOptional({example:1})
  @IsOptional()
  @IsNumberString()
  departmentId?: string;

  @ApiPropertyOptional({example:1})
  @IsOptional()
  @IsNumberString()
  roleId?: string;

  @ApiPropertyOptional({example:"jonathanbuntuguh@yahoo.com"})
   @IsOptional()
  @IsString()
  search?: string;
  
  @ApiPropertyOptional({example:"Yes"})
   @IsOptional()
  @IsString()
  isCollector?: string = "Yes";

}

export class GetUserQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assemblyId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number;
}


export class RequestOtp {
  @IsEmail()
  email: string;
}

export class ResendResetPasswordDTO {
  @IsEmail()
  email: string;
}

export class SendOTPDTO {
  @ApiPropertyOptional({example:"0548255903"})
  @IsOptional()
  phone: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  token: string;

  @MinLength(6)
  password: string;
}
