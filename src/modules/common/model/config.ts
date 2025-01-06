import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { RedisClientOptions } from "redis";

interface RedisConfigOptions {
    enabled: boolean;
    config: RedisClientOptions
}


export interface Config {

    readonly API_PORT: number;

    readonly API_PREFIX: string;

    readonly SWAGGER_ENABLE: number;

    readonly JWT_SECRET: string;
    
    readonly DB_CONFIG: TypeOrmModuleOptions;
    
    readonly redis: RedisConfigOptions

}
