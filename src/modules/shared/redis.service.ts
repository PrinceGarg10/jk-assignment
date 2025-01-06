
import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { Config } from '../common';
import { Service } from '../tokens';

@Injectable()
export class RedisService {
  protected client: any;
  private redisConfig;

  constructor(
    @Inject(Service.CONFIG) private config: Config
  ) {
    this.redisConfig = config.redis

    if (this.redisConfig.enabled) {
      this.client = createClient({...this.redisConfig.config, legacyMode:true})
      this.client.connect()
    }
  }

  public async set(key: string, value: string) {
    return this.client && await this.client.set(key, value);
  }

  public async get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.client && this.client.get(key, (err: any, reply: any) => {
          if (err) {
            reject(err);
          }
          resolve(reply);
        });
    });
  }

  public async setex(key: string, seconds: number, value: string) {

    return this.client && (await this.client.setex(key, seconds, value));
  }

  public async del(key: string) {
    return this.client && (await this.client.del(key));
  }
}
