import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class BooleanStringDto {
  @ApiProperty({
    type: String,
    example: 'true',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^(true|false)$/, {
    message: 'Value must be a boolean string (true or false)',
  })
  booleanString?: "true" | "false" | undefined;
}