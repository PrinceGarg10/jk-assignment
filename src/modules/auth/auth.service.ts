import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login-request.dto';
import { UserService } from '../user/user.service';
import { RedisService } from '../shared/redis.service';
import { HashService } from '../utils/hashService';

@Injectable()
export class AuthService {
    private tokenKeyForRedis = 'AUTH-'
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private readonly redisService: RedisService,

    ) { }



    async login(loginInput: LoginInput) {
        return await this.loginUsingCredentials(loginInput);
    }

    async generateLoginTokens(payload: any) {
        if (payload) {
            const accessToken = this.jwtService.sign(payload.tokenDetails);
            const refreshToken = this.jwtService.sign({ id: payload.tokenDetails.id }, { expiresIn: '30d' });
            //----------------------------------------- TOKEN SET IN REDIS---------------------------------
            this.redisService.setex(this.tokenKeyForRedis + accessToken, 60 * 60 * 12, accessToken)
            this.redisService.setex(this.tokenKeyForRedis + refreshToken, 60 * 60 * 24 * 30, accessToken)
            return {
                token: accessToken,
                refreshToken,
                loginDetails: payload.user,
            }
        }
    }

    async logout(token: string): Promise<any> {
        try {
            token = token.replace('Bearer ', '')
            if (!token) {
                throw new Error("Invalid Token")
            }
            const redisKey = this.tokenKeyForRedis + token
            const deleteToken = await this.redisService.del(redisKey)
            return {
                status: 'Success',
                msg: 'Logout Successfully'
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async loginUsingCredentials(loginInput: any) {
        let user
        if (loginInput.rtoken) {
            const findTokenFromRedis = await this.redisService.get(this.tokenKeyForRedis + loginInput.rtoken)
            if (!findTokenFromRedis) {
                throw new Error("Invalid Token")
            }
            const tokenInfo = await this.jwtService.verifyAsync(loginInput.rtoken)
            if (tokenInfo && tokenInfo.id) {
                user = await this.userService.findOneByQueryForLogin({ id: tokenInfo.id })
            }
        } else {
            user = await this.userService.findOneByQueryForLogin(
                [
                    { username: loginInput.username, isActive: true},
                    { contact: loginInput.username,  isActive: true}
                ]
            );
        }


        if (user) {
            if (loginInput.rtoken) {
                const genToken = await this.generateLoginTokens({
                    tokenDetails: {
                        id: user.id,
                        sub: user.password,
                    },
                    user: user
                });
                return genToken
            }
            else {

                const isvalidated = await HashService.validateHash(
                    loginInput.password,
                    user.password,
                );
                if (isvalidated) {
                    const genToken = await this.generateLoginTokens({
                        tokenDetails: {
                            id: user.id,
                            sub: user.password,
                        },
                        user: user
                    });
                    return genToken
                } else {
                    throw new BadRequestException(
                        'Password is incorrect'
                    );
                }
            }
        }
        throw new NotFoundException('User not found');
    }

    async verifyTokenReturnUser(token: string): Promise<any> {
        let tokenDetails
        try {
            tokenDetails = await this.jwtService.verify(token)

        } catch (e) {
            throw new UnauthorizedException(e)
        }

        const findUser = await this.userService.findOneByQueryForLogin({ id: tokenDetails.id })
        if (findUser?.isActive) {
            return findUser
        }
        throw new UnauthorizedException("User inactive")

    }

}
