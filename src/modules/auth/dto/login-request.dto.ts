import { ApiProperty } from "@nestjs/swagger";

export class LoginInput {
    @ApiProperty({
        description: "either email, username, or contact"
    })
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    rtoken?: string;

}