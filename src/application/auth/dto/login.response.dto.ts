import { ApiProperty } from "@nestjs/swagger";


export class LoginResponseDto {
    @ApiProperty({ type: String })
    access_token: string
}