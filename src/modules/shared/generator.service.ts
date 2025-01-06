import {uuid} from 'uuidv4';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorService {
    public uuid(): string {
        return uuid()
    }
    
    public fileName(ext: string) {
        return this.uuid() + '.' + ext;
    }

    public fileNameWithoutExt() {
      return this.uuid();
    }
}
