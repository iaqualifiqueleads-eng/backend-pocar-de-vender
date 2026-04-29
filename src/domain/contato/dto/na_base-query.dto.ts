
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NaBaseQueryDto {

  @ApiProperty({
    type: String,
    description: 'true | false | undefined',
    required: false,
    name: 'na_base',
  })
  @IsString()
  @IsOptional()
  public readonly na_base?: string;
}