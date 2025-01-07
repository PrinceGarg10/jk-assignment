import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentEntity } from './entity/document.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from '../common/constants/document-status';

describe('DocumentService', () => {
  let service: DocumentService;
  let repository: Repository<DocumentEntity>;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repository = module.get<Repository<DocumentEntity>>(getRepositoryToken(DocumentEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a document', async () => {
      const createDto: any = {
        "title": "string",
        "filePath": "string",
        "fileType": "string",
        "fileSize": 0,
        "description": "string",
        "statusMessage": "string",
      }
      const createdDocument = { ...createDto, id: 1 };

      mockDocumentRepository.create.mockReturnValue(createdDocument);
      mockDocumentRepository.save.mockResolvedValue(createdDocument);

      const result = await service.create(createDto);

      expect(result).toEqual(createdDocument);
      expect(mockDocumentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(createdDocument);
    });

    it('should throw BadRequestException when save fails', async () => {
      const createDto: any = {
        "title": "string",
        "filePath": "string",
        "fileType": "string",
        "fileSize": 0,
        "description": "string",
        "statusMessage": "string",
      }
      const error = new Error('Some error');
      
      mockDocumentRepository.create.mockReturnValue(createDto);
      mockDocumentRepository.save.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a document if found', async () => {
      const documentId = 1;
      const document = { id: documentId, title: 'Document' };
      
      mockDocumentRepository.findOne.mockResolvedValue(document);

      const result = await service.findOne(documentId);

      expect(result).toEqual(document);
      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
    });

    it('should throw BadRequestException if document not found', async () => {
      const documentId = 1;

      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(documentId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on error', async () => {
      const documentId = 1;

      mockDocumentRepository.findOne.mockRejectedValue(new Error('Some error'));

      await expect(service.findOne(documentId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should successfully update a document', async () => {
      const updateDto: UpdateDocumentDto = { id: 1, title: 'Updated Title' };
      const document = { id: 1, title: 'Updated Title' };

      mockDocumentRepository.preload.mockResolvedValue(document);
      mockDocumentRepository.save.mockResolvedValue(document);

      const result = await service.update(updateDto);

      expect(result).toEqual(document);
      expect(mockDocumentRepository.preload).toHaveBeenCalledWith(updateDto);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(document);
    });

    it('should throw BadRequestException when document is not found', async () => {
      const updateDto: UpdateDocumentDto = { id: 1, title: 'Updated Title' };

      mockDocumentRepository.preload.mockResolvedValue(null);

      await expect(service.update(updateDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on error', async () => {
      const updateDto: UpdateDocumentDto = { id: 1, title: 'Updated Title' };

      mockDocumentRepository.preload.mockRejectedValue(new Error('Some error'));

      await expect(service.update(updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should successfully remove a document', async () => {
      const documentId = 1;
      const document = { id: documentId, title: 'Document to delete' };

      mockDocumentRepository.findOne.mockResolvedValue(document);
      mockDocumentRepository.remove.mockResolvedValue(undefined);

      const result = await service.remove(documentId);

      expect(result).toEqual({ status: 'success', message: 'Document deleted successfully!' });
      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(mockDocumentRepository.remove).toHaveBeenCalledWith(document);
    });

    it('should throw BadRequestException if document is not found', async () => {
      const documentId = 1;

      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(documentId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on error', async () => {
      const documentId = 1;

      mockDocumentRepository.findOne.mockRejectedValue(new Error('Some error'));

      await expect(service.remove(documentId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return documents with pagination', async () => {
      const filter = { status: DocumentStatus.PENDING };
      const page = 1;
      const limit = 10;
      const documents = [{ id: 1, title: 'Document 1' }];
      const total = 1;

      mockDocumentRepository.findAndCount.mockResolvedValue([documents, total]);

      const result = await service.findAll({ ...filter, page, limit });

      expect(result).toEqual({ data: documents, total, page, limit });
      expect(mockDocumentRepository.findAndCount).toHaveBeenCalledWith({
        where: filter,
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'asc' },
      });
    });

    it('should throw BadRequestException on error', async () => {
      mockDocumentRepository.findAndCount.mockRejectedValue(new Error('Some error'));

      await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow(BadRequestException);
    });
  });
});
