import * as Joi from 'joi';
import * as _ from 'lodash';

import { Service } from '../../tokens';
import { Config } from '../model';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

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