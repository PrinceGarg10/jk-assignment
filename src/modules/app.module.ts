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
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { DocumentEntity } from './document/entity/document.entity';

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
              entities: [
                UserEntity, DocumentEntity
              ]
            }
        },
    }),
      CommonModule,
      GeneralModule,
      UserModule,
      AuthModule,
      DocumentModule,
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class ApplicationModule { }
