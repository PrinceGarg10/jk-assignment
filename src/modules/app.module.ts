import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CommonModule, Config } from './common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GeneralModule } from './general/general.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Service } from './tokens';

@Module({
    imports: [
      ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      }),
      TypeOrmModule.forRootAsync({
        imports: [CommonModule],
        inject: [Service.CONFIG],
        useFactory: (config: Config): TypeOrmModuleOptions => {
            return config.DB_CONFIG
        },
    }),
      CommonModule,
      GeneralModule
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class ApplicationModule { }
