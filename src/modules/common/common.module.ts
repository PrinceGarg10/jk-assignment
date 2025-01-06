import { Module } from '@nestjs/common';
import { LogInterceptor } from './flow';
import { configProvider } from './provider';
import { FileSystemService } from '../shared/file-system.service';

@Module({
    providers: [
        configProvider,
        LogInterceptor,
        FileSystemService
    ],
    exports: [
        configProvider,
        LogInterceptor,
        FileSystemService
    ]
})
export class CommonModule { }
