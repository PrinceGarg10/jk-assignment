import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { RoleEnum } from '../common/constants/role';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Gender } from '../common/constants/gender';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  // Mock the repository methods
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    preload: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'testuser@example.com',
        contact: '1234567890',
        password: 'password123',
        role: RoleEnum.ADMIN,
        gender: Gender.MALE,
        dob: new Date(),
        isActive: true,
      };
      const mockUser = { id: 1, ...createUserDto };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a BadRequestException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {

      const updateUserDto: UpdateUserDto = { id: 1, name: 'Updated User' };
      const mockUser = { id: 1, name: 'Updated User' };
      mockUserRepository.preload.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.update(updateUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.preload).toHaveBeenCalledWith(updateUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if user to update is not found', async () => {

      const updateUserDto: UpdateUserDto = { id: 1, name: 'Updated User' };
      mockUserRepository.preload.mockResolvedValue(null);


      await expect(userService.update(updateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {

      const mockUser = { id: 1, name: 'Test User' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);


      const result = await userService.remove(1);

      expect(result).toEqual({ status: 'success', message: 'User deleted successfully!' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if user to remove is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users with pagination', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await userService.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        order: { name: 'asc' },
      });
    });
  });
});
