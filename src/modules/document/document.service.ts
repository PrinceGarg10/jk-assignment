import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentEntity } from './entity/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) { }


  async create(data: CreateDocumentDto) {
    try {

      const document = this.documentRepository.create(data);
      try {
        return await this.documentRepository.save(document);
      } catch (e) {
        throw new BadRequestException(e);
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<DocumentEntity | null> {
    try {
      const document = await this.documentRepository.findOne({ where: { id: id}});
      if (!document) {
        throw new NotFoundException('Document not found!');
      }
      return document;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(data: UpdateDocumentDto): Promise<DocumentEntity> {
    try {
      const { id, ...updateData } = data;
      const document = await this.documentRepository.preload({
        id,
        ...updateData,
      });
      if (!document) {
        throw new NotFoundException('No document found!');
      }
      return await this.documentRepository.save(document);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(data: any): Promise<any> {
    try {
      const filter: any = {};
      if (data.uploadedBy) {
        filter['uploadedBy'] = data.uploadedBy;
      }
      if (data.lastUpdatedBy) {
        filter['lastUpdatedBy'] = data.lastUpdatedBy;
      }
      if (data.status) {
        filter['status'] = data.status;
      }

      const page = +data.page || 1;
      const limit = +data.limit || 10;
      const sortBy = data.sortBy || 'asc';
      const sortKey = data.sortKey || 'name';

      if (data.noPaginate) {
        return await this.documentRepository.find({
          where: filter,
          order: { [sortKey]: sortBy },
        });
      }

      const [results, total] = await this.documentRepository.findAndCount({
        where: filter,
        take: limit,
        skip: (page - 1) * limit,
        order: { [sortKey]: sortBy },
      });

      return {
        data: results,
        total,
        page,
        limit,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: any): Promise<any> {
    try {
      const document = await this.findOne(id);
      if (document) {
        await this.documentRepository.remove(document);
        return { status: 'success', message: 'Document deleted successfully!' };
      } else {
        throw new NotFoundException('Document not found');
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
