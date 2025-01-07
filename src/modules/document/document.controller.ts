import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Authorized } from '../decorators/authorized.decorator';
import { RoleEnum } from '../common/constants/role';
import { CurrentUser } from '../decorators/current.user.decorator';

@Controller('document')
@ApiTags("document")
export class DocumentController {
    constructor(
        private documentService: DocumentService
    ) { }

    @Authorized(RoleEnum.ADMIN, RoleEnum.EDITOR)
    @Post()
    async createBySysadmin(@Body() createDocumentDto: CreateDocumentDto, @CurrentUser() user: any) {
        createDocumentDto.uploadedBy = user.id
        createDocumentDto.lastUpdatedBy = user.id
        return await this.documentService.create(createDocumentDto);
    }


    @Authorized()
    @Get('all')
    async findAll(@Query() query: any) {
        return await this.documentService.findAll(query);
    }


    @Authorized()
    @Get()
    async findOne(@Query('id') id: number) {
        return await this.documentService.findOne(id);
    }

    @Authorized(RoleEnum.ADMIN, RoleEnum.EDITOR)
    @Patch()
    async update(@Body() updateDocumentDto: UpdateDocumentDto, @CurrentUser() user: any) {
        updateDocumentDto.lastUpdatedBy = user.id
        return await this.documentService.update(updateDocumentDto);
    }

    @Authorized(RoleEnum.ADMIN)
    @Delete()
    async remove(@Query('id') id: number) {
        return await this.documentService.remove(id);
    }

}
