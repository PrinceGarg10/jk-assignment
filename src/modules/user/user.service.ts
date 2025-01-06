import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { generateIdCharacters } from '../utils/GenerateCharacter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUniqueUsername(user: CreateUserDto): Promise<string> {
    const chars = generateIdCharacters(3);
    let firstname;
    if (!user.name) {
      if (user.contact) {
        firstname = user.contact;
      } else {
        firstname = user.email?.split('@')[0];
      }
    } else {
      firstname = user.name.split(' ')[0];
    }
    const username = firstname + chars;
    return username;
  }

  async create(data: CreateUserDto) {
    try {
      const unique = await this.getUniqueUsername(data);
      data.username = unique;
      data.password = data.password || unique + '@pass';

      // Create user
      const user = this.userRepository.create(data);
      try {
        return await this.userRepository.save(user);
      } catch (e) {
        throw new BadRequestException(e);
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id}});
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(data: UpdateUserDto): Promise<UserEntity> {
    try {
      const { id, ...updateData } = data;
      const user = await this.userRepository.preload({
        id,
        ...updateData,
      });
      if (!user) {
        throw new NotFoundException('No user found!');
      }
      return await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(data: any): Promise<any> {
    try {
      const filter: any = {};
      if (data.role) {
        filter['role'] = data.role;
      }
      if (data.name) {
        filter['name'] = ILike(`%${data.name}%`);
      }
      if (data.contact) {
        filter['contact'] = ILike(`%${data.contact}%`);
      }

      const page = +data.page || 1;
      const limit = +data.limit || 10;
      const sortBy = data.sortBy || 'asc';
      const sortKey = data.sortKey || 'name';

      if (data.noPaginate) {
        return await this.userRepository.find({
          where: filter,
          order: { [sortKey]: sortBy },
        });
      }

      const [results, total] = await this.userRepository.findAndCount({
        where: filter,
        take: limit,
        skip: (page - 1) * limit,
        order: { [sortKey]: sortBy },
      });

      return {
        data: results,
        total,
        page,
        limit,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOneByQueryForLogin(query: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: query });
      return user;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOneByQuery(query: any): Promise<any> {
    try {
      return await this.userRepository.findOne({ where: query });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findByQuery(query: any): Promise<any> {
    try {
      return await this.userRepository.find({ where: query });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: any): Promise<any> {
    try {
      const user = await this.findOne(id);
      if (user) {
        await this.userRepository.remove(user);
        return { status: 'success', message: 'User deleted successfully!' };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
