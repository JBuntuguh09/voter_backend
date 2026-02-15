import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, isString, IsEnum, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
import {  TransactionStatusEnum } from '../enum/enums.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Active', description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '886-0793-0152-1', description: 'Search by...' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({example:1, description:'Filter by region id'})
  @IsOptional()
  regionId: number;
  
  @ApiPropertyOptional({example:1, description:'Filter by assembly id'})
  @IsOptional()
  assemblyId: number;
  


}


export class FinanceFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  assemblyId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  regionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TransactionStatusEnum })
  @IsOptional()
  @IsEnum(TransactionStatusEnum)
  transactionStatus?: TransactionStatusEnum;



  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  page?: number ;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() 
  @IsInt()
    zoneId?: number;

    @ApiPropertyOptional({ example: 'Zone A' })
    @IsOptional()
    @IsString()
    zoneName?: string;

    @ApiPropertyOptional({example:"2025"})
    @IsOptional()
    @IsString()
    year?: string;
      @ApiPropertyOptional({example:"1"})
    @IsOptional()
    propertyRateId?: string;

    @ApiPropertyOptional({example:"2"})
    @IsOptional()
    operatingPermitId?: string;

    @ApiPropertyOptional({example: "3"})
    @IsOptional()
    otherRevenueId?: string;

    @ApiPropertyOptional({ example: '2025-01-01' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({ example: '2025-12-31' })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiPropertyOptional({ example: 'Successful' })
    @IsOptional()
    @IsString()
    deliveryStatus?: string;

    // @ApiPropertyOptional({ example: 1 })
    // @IsInt()
    // electoralAreaId: number;

    // @ApiPropertyOptional({ example: 'Area 1' })
    // @IsString()
    // electoralAreaName: string;

    // @ApiPropertyOptional({ example: 1 })
    // @IsInt()
    // communityId: number;

    // @ApiPropertyOptional({ example: 'Community 1' })
    // @IsString()
    // communityName: string;
  
}




