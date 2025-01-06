import { TypeOrmModuleOptions } from "@nestjs/typeorm";



export interface Config {

    readonly API_PORT: number;

    readonly API_PREFIX: string;

    readonly SWAGGER_ENABLE: number;

    readonly JWT_SECRET: string;
    
    readonly DB_CONFIG: TypeOrmModuleOptions
}
