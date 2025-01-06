import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../../common/constants/role";
import { Gender } from "../../common/constants/gender";

export class CreateUserDto {
    @ApiProperty()
    name?: string;

    @ApiProperty()
    desc?: string;

    @ApiProperty()
    dob?: Date;

    @ApiProperty()
    isActive?: boolean;

    @ApiProperty()
    isLoginOtp?: boolean;

    @ApiProperty()
    contact?: string;

    @ApiProperty()
    role?: RoleEnum;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    gender?: Gender;

    @ApiProperty()
    password?: string;

    // @ApiProperty()
    hash?: string;

    @ApiProperty()
    username?: string;

}