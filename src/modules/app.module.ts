import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CommonModule } from './common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GeneralModule } from './general/general.module';

@Module({
    imports: [
      ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
      CommonModule,
      GeneralModule
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class ApplicationModule { }
