import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileSystemService } from '../shared/file-system.service';

@Controller('app')
@ApiTags("general")
export class GeneralController {
  constructor(
    private generalService: GeneralService,
    private fileSystemService: FileSystemService
  ) { }



  @Get('role')
  getRole() {
    return this.generalService.getRole();
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async saveFile(@UploadedFile() file: any): Promise<any> {
    const resp = await this.fileSystemService.uploadContent(file)
    return resp
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file'))
  async saveFileToAws(@UploadedFile() file: any): Promise<any> {
    return await this.fileSystemService.uploadContent(file)
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  async saveFiles(@UploadedFiles() files: any): Promise<any> {
    const UploadedFile: any[] = []
    for (const file of files) {
      const resp = await this.fileSystemService.uploadContent(file)
      UploadedFile.push(resp)
    }
    return UploadedFile
  }


  @Delete('file')
  async deleteFileFromAws(@Query('fileUrl') fileUrl: string): Promise<any> {
    const resp = await this.fileSystemService.deleteFileFromLocal(fileUrl);
    return resp
  }
}
