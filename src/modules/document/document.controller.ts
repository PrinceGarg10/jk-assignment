import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Authorized } from '../decorators/authorized.decorator';
import { RoleEnum } from '../common/constants/role';

@Controller('document')
@ApiTags("document")
export class DocumentController {
    constructor(
        private documentService: DocumentService
    ) { }

    @Authorized(RoleEnum.ADMIN)
    @Post()
    async createBySysadmin(@Body() createDocumentDto: CreateDocumentDto) {
        return await this.documentService.create(createDocumentDto);
    }


    @Authorized(RoleEnum.ADMIN)
    @Get('all')
    async findAll(@Query() query: any) {
        return await this.documentService.findAll(query);
    }


    @Authorized(RoleEnum.ADMIN)
    @Get()
    async findOne(@Query('id') id: number) {
        return await this.documentService.findOne(id);
    }

    @Authorized(RoleEnum.ADMIN)
    @Patch()
    async update(@Body() updateDocumentDto: UpdateDocumentDto) {
        return await this.documentService.update(updateDocumentDto);
    }

    @Authorized(RoleEnum.ADMIN)
    @Delete()
    async remove(@Query('id') id: string) {
        return await this.documentService.remove(id);
    }

}
