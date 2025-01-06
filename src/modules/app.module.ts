import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CommonModule } from './common';
import { GeneralModule } from './general/general.module';

@Module({
    imports: [
      CommonModule,
      GeneralModule
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class ApplicationModule { }
