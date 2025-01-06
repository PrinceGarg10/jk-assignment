import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { GeneratorService } from './generator.service';
import * as fs from 'fs';
import * as path from 'path';

export interface IFile {
    buffer: Buffer;  
    mimetype: string;  
    size: number;
  }

@Injectable()
export class FileSystemService {
    private readonly baseDir: string = path.join(process.cwd(), 'uploads');
    private readonly hosting: string = `${process.env.BASE_URL || "http://localhost"}:${process.env.API_PORT || 3000}` 
    private readonly defaultFolder: string = 'media';

    constructor(private readonly generatorService: GeneratorService) {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }

    async uploadContent(file: IFile, folderKey = this.defaultFolder): Promise<any> {
        return this.uploadFileToLocal(file, 'content', folderKey);
    }

    async uploadFileToLocal(file: IFile, pathType = this.defaultFolder, folderKey = ''): Promise<any> {
        if (folderKey) {
            if (!folderKey.endsWith('/')) {
                folderKey = folderKey + '/';
            }
        }

        // Generate the file name
        const fileName = this.generatorService.fileName(<string>mime.extension(file.mimetype));
        const filePath = path.join(this.baseDir, pathType, folderKey, fileName);
        const fileUrl = `${this.hosting}/uploads/${pathType}/${folderKey}${fileName}`

        try {
            // Create folder if it doesn't exist
            const folderPath = path.dirname(filePath);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            fs.writeFileSync(filePath, file.buffer);

            return {
                uploaded: 1,
                fileName,
                type: file.mimetype,
                size: file.size,
                url: fileUrl,
            };
        } catch (error) {
            return {
                uploaded: 0,
                file: null,
                url: null,
                error: error.message,
            };
        }
    }

    async deleteFileFromLocal(filePath: string): Promise<any> {
        try {
            const relativeFilePath = filePath.replace(`${this.hosting}/uploads`, '');
            const fullFilePath = path.join(this.baseDir, relativeFilePath);

            if (fs.existsSync(fullFilePath)) {
                fs.unlinkSync(fullFilePath);
                return {
                    status: 'Success',
                    message: 'File successfully deleted',
                };
            } else {
                throw new Error('File not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async downloadFile(filePath: string): Promise<any> {
        try {
            const fullFilePath = path.join(this.baseDir, filePath);

            if (fs.existsSync(fullFilePath)) {
                const fileStream = fs.createReadStream(fullFilePath);
                const mimeType = mime.lookup(fullFilePath);

                return {
                    file: fileStream,
                    mimeType,
                };
            } else {
                throw new Error('File not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
