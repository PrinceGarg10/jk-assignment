import { Module } from '@nestjs/common';
import { LogInterceptor } from './flow';
import { configProvider } from './provider';

@Module({
    providers: [
        configProvider,
        LogInterceptor,
    ],
    exports: [
        configProvider,
        LogInterceptor,
    ]
})
export class CommonModule { }
