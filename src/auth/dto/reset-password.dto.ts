import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class resetPasswordDTO{

    @ApiProperty({example: 'tjgffhjgui7667564ght5hvy67f7fhjkthty7gh8ijklkho87fhbkhhffjkdfdgbmjgyu9'})
    @IsString()
    token: string;

    @ApiProperty({example:'12345678', description:'New password'})
    @IsString()
    @IsNotEmpty({message:'Password is required'})
    @MinLength(3, {message:'Password must be more than 3 characters'})
    password: string;
}

export class RequestOtp{
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty({message:'Email is required'})
    @IsEmail({}, {message:"Enter a valid email"})
    email: string;

}