import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CommonModule, Config } from './common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GeneralModule } from './general/general.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Service } from './tokens';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';

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
            return {
              ...config.DB_CONFIG,
              entities: [UserEntity]
            }
        },
    }),
      CommonModule,
      GeneralModule,
      UserModule
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class ApplicationModule { }
