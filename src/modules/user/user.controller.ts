import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@ApiTags("user")
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post()
    async createBySysadmin(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }


    @Get('all')
    async findAll(@Query() query: any) {
        return await this.userService.findAll(query);
    }


    @Get()
    async findOne(@Query('id') id: number) {
        return await this.userService.findOne(id);
    }

    @Patch()
    async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(updateUserDto);
    }


    @Delete()
    async remove(@Query('id') id: string) {
        return await this.userService.remove(id);
    }

}
