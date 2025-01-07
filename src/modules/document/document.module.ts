import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entity/document.entity';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CommonModule } from '../common';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([DocumentEntity])
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]

})
export class DocumentModule { }
