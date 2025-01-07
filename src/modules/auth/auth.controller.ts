import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-request.dto';

@Controller('auth')
@ApiTags("auth")
export class AuthController {
    constructor(private authService: AuthService,
    ) { }

    @Post("login")
    async login(@Body() loginInput: LoginInput) {
        const resp: any = await this.authService.login(loginInput)
        return resp
    }

    @Post("logout")
    async logout(@Headers() header: any) {
        let authToken = header.authorization
        const resp: any = await this.authService.logout(authToken)
        return resp
    }
}
