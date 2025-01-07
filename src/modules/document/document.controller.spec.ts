import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleEnum } from '../common/constants/role';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  // Mocks
  const mockDocumentService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 1, role: RoleEnum.ADMIN };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBySysadmin', () => {
    it('should call DocumentService.create with the correct arguments', async () => {
      const createDto: any = {
        "title": "string",
        "filePath": "string",
        "fileType": "string",
        "fileSize": 0,
        "description": "string",
        "statusMessage": "string",
      }
      const createdDocument = { ...createDto, id: 1, uploadedBy: mockUser.id, lastUpdatedBy: mockUser.id };

      // Mock service response
      mockDocumentService.create.mockResolvedValue(createdDocument);

      const result = await controller.createBySysadmin(createDto, mockUser);

      expect(result).toEqual(createdDocument);
      expect(mockDocumentService.create).toHaveBeenCalledWith({
        ...createDto,
        uploadedBy: mockUser.id,
        lastUpdatedBy: mockUser.id,
      });
    });
  });

  describe('findAll', () => {
    it('should call DocumentService.findAll and return documents', async () => {
      const documents = [{ id: 1, title: 'Test Document' }];
      const query = { page: 1, limit: 10 };

      mockDocumentService.findAll.mockResolvedValue(documents);

      const result = await controller.findAll(query);

      expect(result).toEqual(documents);
      expect(mockDocumentService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle errors from DocumentService.findAll', async () => {
      const query = { page: 1, limit: 10 };

      mockDocumentService.findAll.mockRejectedValue(new BadRequestException('Error fetching documents'));

      await expect(controller.findAll(query)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should call DocumentService.findOne and return a document', async () => {
      const document = { id: 1, title: 'Test Document' };
      const id = 1;

      mockDocumentService.findOne.mockResolvedValue(document);

      const result = await controller.findOne(id);

      expect(result).toEqual(document);
      expect(mockDocumentService.findOne).toHaveBeenCalledWith(id);
    });

    it('should handle errors from DocumentService.findOne', async () => {
      const id = 1;

      mockDocumentService.findOne.mockRejectedValue(new BadRequestException('Error fetching document'));

      await expect(controller.findOne(id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should call DocumentService.update with the correct arguments', async () => {
      const updateDto: UpdateDocumentDto = { id: 1, title: 'Updated Title' };
      const updatedDocument = { ...updateDto, lastUpdatedBy: mockUser.id };

      mockDocumentService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update(updateDto, mockUser);

      expect(result).toEqual(updatedDocument);
      expect(mockDocumentService.update).toHaveBeenCalledWith({
        ...updateDto,
        lastUpdatedBy: mockUser.id,
      });
    });

    it('should handle errors from DocumentService.update', async () => {
      const updateDto: UpdateDocumentDto = { id: 1, title: 'Updated Title' };

      mockDocumentService.update.mockRejectedValue(new BadRequestException('Error updating document'));

      await expect(controller.update(updateDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should call DocumentService.remove and delete a document', async () => {
      const id = 1
      const response = { status: 'success', message: 'Document deleted successfully!' };

      mockDocumentService.remove.mockResolvedValue(response);

      const result = await controller.remove(id);

      expect(result).toEqual(response);
      expect(mockDocumentService.remove).toHaveBeenCalledWith(id);
    });

    it('should handle errors from DocumentService.remove', async () => {
      const id = 1

      mockDocumentService.remove.mockRejectedValue(new BadRequestException('Error deleting document'));

      await expect(controller.remove(id)).rejects.toThrow(BadRequestException);
    });
  });
});
