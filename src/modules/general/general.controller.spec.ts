import { Test, TestingModule } from '@nestjs/testing';
import { GeneralController } from './general.controller';
import { GeneralService } from './general.service';
import { FileSystemService } from '../shared/file-system.service';

describe('GeneralController', () => {
  let controller: GeneralController;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralController],
      providers: [
        {
          provide: GeneralService,
          useValue: GeneralService,
        },
        {
          provide: FileSystemService,
          useValue: FileSystemService,
        },
      ],
    }).compile();

    controller = module.get<GeneralController>(GeneralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
