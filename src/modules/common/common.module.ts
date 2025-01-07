import { Module } from '@nestjs/common';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService } from './provider';
import { FileSystemService } from '../shared/file-system.service';
import { GeneratorService } from '../shared/generator.service';
import { RedisService } from '../shared/redis.service';

@Module({
    providers: [
        configProvider,
        LogInterceptor,
        FileSystemService,
        LoggerService,
        GeneratorService,
        RedisService
    ],
    exports: [
        configProvider,
        LogInterceptor,
        FileSystemService,
        LoggerService,
        GeneratorService,
        RedisService
    ]
})
export class CommonModule { }
