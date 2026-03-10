import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @ApiProperty({
    type: String,
    description: 'Texto de busca.',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
