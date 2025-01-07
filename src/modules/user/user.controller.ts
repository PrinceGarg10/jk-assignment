import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Authorized } from '../decorators/authorized.decorator';
import { RoleEnum } from '../common/constants/role';

@Controller('user')
@ApiTags("user")
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Authorized(RoleEnum.ADMIN)
    @Post()
    async createBySysadmin(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }


    @Authorized(RoleEnum.ADMIN)
    @Get('all')
    async findAll(@Query() query: any) {
        return await this.userService.findAll(query);
    }


    @Authorized(RoleEnum.ADMIN)
    @Get()
    async findOne(@Query('id') id: number) {
        return await this.userService.findOne(id);
    }

    @Authorized(RoleEnum.ADMIN)
    @Patch()
    async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(updateUserDto);
    }

    @Authorized(RoleEnum.ADMIN)
    @Delete()
    async remove(@Query('id') id: number) {
        return await this.userService.remove(id);
    }

}
