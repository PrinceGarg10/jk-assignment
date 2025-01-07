import { ApiProperty } from "@nestjs/swagger";
import { DocumentStatus } from "../../common/constants/document-status";
import { UserEntity } from "../../user/entity/user.entity";

export class CreateDocumentDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    fileType: string;

    @ApiProperty()
    fileSize: number;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    uploadedBy: UserEntity;

    @ApiProperty()
    lastUpdatedBy: UserEntity;

    @ApiProperty()
    status?: DocumentStatus;

    @ApiProperty()
    statusMessage?: string;

}