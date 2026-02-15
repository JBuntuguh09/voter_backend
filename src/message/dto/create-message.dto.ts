import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export enum PriorityEnum {
    LOW = 'Low',
    NORMAL = 'Normal',
    HIGH = 'High',
    URGENT = 'Urgent',
}

export enum ChannelEnum {
    SYSTEM = 'System',
    EMAIL = 'Email',
    SMS = 'SMS',
    PUSH = 'Push',
}

export class CreateMessageDto {
    @ApiPropertyOptional({ example: 'Payment Successful' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: 'Your payment has been processed successfully' })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiPropertyOptional({ example: 'Notification' })
    @IsOptional()
    @IsString()
    messageType?: string;

    @ApiPropertyOptional({ example: 'Successful' })
    @IsOptional()
    @IsString()
    messageStatus?: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    recipientName?: string;

    @ApiPropertyOptional({ example: 'john@email.com' })
    @IsOptional()
    @IsString()
    recipientAddress?: string;
    
    @ApiPropertyOptional({ example: 'Any extra information' })
    @IsOptional()
    @IsString()
    details?: string;

    @ApiPropertyOptional({ enum: PriorityEnum, example: PriorityEnum.NORMAL })
    @IsOptional()
    @IsEnum(PriorityEnum)
    priority?: PriorityEnum;

    @ApiPropertyOptional({ enum: ChannelEnum, example: ChannelEnum.SYSTEM })
    @IsOptional()
    @IsEnum(ChannelEnum)
    channel?: ChannelEnum;

    @ApiPropertyOptional({ example: 'Permit' })
    @IsOptional()
    @IsString()
    referenceType?: string;

    @ApiPropertyOptional({ example: '12345' })
    @IsOptional()
    @IsString()
    referenceId?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    assemblyId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsNumber()
    fromUserId?: number;
}