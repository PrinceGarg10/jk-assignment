import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../common/constants/role';

@Injectable()
export class GeneralService {
  constructor(
  ) { }

  getRole() {
    const roles: any = { ...RoleEnum }
    return Object.values(roles)
  }

}
