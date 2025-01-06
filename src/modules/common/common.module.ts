import { Module } from '@nestjs/common';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService } from './provider';
import { FileSystemService } from '../shared/file-system.service';
import { GeneratorService } from '../shared/generator.service';

@Module({
    providers: [
        configProvider,
        LogInterceptor,
        FileSystemService,
        LoggerService,
        GeneratorService
    ],
    exports: [
        configProvider,
        LogInterceptor,
        FileSystemService,
        LoggerService,
        GeneratorService
    ]
})
export class CommonModule { }
