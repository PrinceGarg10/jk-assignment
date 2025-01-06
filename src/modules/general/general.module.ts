import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { GeneralController } from './general.controller';
import { GeneralService } from './general.service';

@Module({
  imports: [
    CommonModule,
  ],
  controllers: [GeneralController],
  providers: [GeneralService],
  exports: [GeneralService]
})
export class GeneralModule { }
