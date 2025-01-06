import * as Joi from 'joi';
import * as _ from 'lodash';

import { Service } from '../../tokens';
import { Config } from '../model';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { valueToBoolean } from '../../utils/ToBoolean';

export const configProvider = {

    provide: Service.CONFIG,
    useFactory: (): Config => {
        dotenv.config()
        const env = process.env;
        const validationSchema = Joi.object().unknown().keys({
            API_PORT: Joi.string().required(),
            API_PREFIX: Joi.string().required(),
            SWAGGER_ENABLE: Joi.string().required(),
            PG_PORT: Joi.string().required(),
            PG_USERNAME: Joi.string().required(),
            PG_DATABASE: Joi.string().required(),
            PG_HOST: Joi.string().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_ISSUER: Joi.string().required(),


        });

        const result = validationSchema.validate(env);

        if (result.error) {
            throw new Error('Configuration not valid: ' + result.error.message);
        }

        return {
            API_PORT: _.toNumber(env.API_PORT),
            API_PREFIX: `${env.API_PREFIX}`,
            SWAGGER_ENABLE: _.toNumber(env.SWAGGER_ENABLE),
            JWT_SECRET: `${env.JWT_SECRET}`,
            redis: {
                enabled: valueToBoolean(process.env.REDIS),
                config: {
                    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${parseInt(process.env.REDIS_PORT as string, 10) || 6379}`,
                    database: parseInt(process.env.REDIS_DATABASE as string, 10) || 2,
                }
            },
            DB_CONFIG: {
                type: 'postgres',
                username: `${env.PG_USERNAME}`,
                port: Number(env.PG_PORT),
                host: `${env.PG_HOST}`,
                password: `${env.PG_PASSWORD}`,
                database: `${env.PG_DATABASE}`,
                synchronize: true,
            }
        };
    }
};