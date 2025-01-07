import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RedisService } from '../shared/redis.service';
import { LoginInput } from './dto/login-request.dto';
import { HashService } from '../utils/hashService';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let redisService: RedisService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedAccessToken'),
    verifyAsync: jest.fn().mockResolvedValue({ id: 1 }),
  };

  const mockUserService = {
    findOneByQueryForLogin: jest.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      isActive: true,
    }),
  };

  const mockRedisService = {
    setex: jest.fn(),
    get: jest.fn().mockResolvedValue('mockedToken'),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login a user and generate tokens', async () => {
      const loginInput: LoginInput = {
        username: 'sysadmin',
        password: 'sysadmin@pass',
      };

      jest.spyOn(HashService, 'validateHash').mockResolvedValue(true);

      const result = await authService.login(loginInput);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('loginDetails');

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(mockUserService.findOneByQueryForLogin).toHaveBeenCalledWith([
        { username: loginInput.username, isActive: true },
        { contact: loginInput.username, isActive: true },
      ]);
      expect(mockRedisService.setex).toHaveBeenCalled();
    });
  });
});
