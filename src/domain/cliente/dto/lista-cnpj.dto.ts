import { ApiProperty } from "@nestjs/swagger";


export class ListaCnpj {
  @ApiProperty({
    type: String,
    example: '123,456,789,000',
    description: 'CNPJs separados por virgula',
    required: true,
  })
  itens: string
}