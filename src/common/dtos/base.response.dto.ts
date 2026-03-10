import { ApiProperty } from "@nestjs/swagger";
export class BaseResponseDto {
    @ApiProperty({
        type: String,
    })
    id: string;

    @ApiProperty({

        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        type: Date,
    })
    updatedAt: Date;

    @ApiProperty({
        type: Date,
        required: false,
        nullable: true,
    })
    deletedAt: Date | null;
}