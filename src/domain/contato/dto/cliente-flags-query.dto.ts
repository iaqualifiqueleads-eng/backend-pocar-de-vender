import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClienteFlagsQueryDto {
  @ApiProperty({ type: String, description: 'true | false | undefined', required: false, name: 'estocado' })
  @IsString()
  @IsOptional()
  public readonly estocado?: string;

  @ApiProperty({ type: String, description: 'true | false | undefined', required: false, name: 'prefere_fornecedor_atual' })
  @IsString()
  @IsOptional()
  public readonly prefere_fornecedor_atual?: string;
}
