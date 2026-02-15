export class CreateEmailDto {}
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { CreateMessageDto } from "src/message/dto/create-message.dto";


export class SendEmailDTO extends CreateMessageDto{
    @ApiPropertyOptional({ example: ['recipient1@example.com', 'recipient2@example.com'] })
    @IsEmail({}, {message:"Recipients must be email", each: true})
    recipient: string[]

    @ApiPropertyOptional({ example: 'Handles revenue and expenditure' })
    @IsString()
    subject: string;
    
    @ApiPropertyOptional({ example: '<h1>Your HTML content here</h1>' })
    @IsString()
    html: string;

    @ApiPropertyOptional({ example: 'Plain text version of the email' })
    @IsOptional()
    @IsString()
    text: string;
   
}