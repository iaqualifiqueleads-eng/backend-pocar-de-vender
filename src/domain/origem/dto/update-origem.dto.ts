import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateOrigemDto {
  @ApiProperty({
    type: String,
    example: "Vindo de fulano",
    required: true
  })
  @IsString()
  nome: string
}


