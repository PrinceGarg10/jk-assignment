import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Gender } from '../../common/constants/gender';
import { RoleEnum } from '../../common/constants/role';
import { HashService } from '../../utils/hashService';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;  // Auto-generated primary key

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column('date')
  dob: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10, unique: true })
  contact: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.ADMIN
  })
  role: RoleEnum;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: Object.values(Gender),
  })
  gender: Gender;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ default: false })
  isLoginOtp: boolean;

  @Column()
  password: string;

  @Column()
  hash: string;

  // Hooks to handle password hashing before insert/update
  @BeforeInsert()
  @BeforeUpdate()
  hshPassword() {
    if (this.password) {
      this.password =  HashService.generateHash(this.password);
      this.hash = HashService.base64Encode(this.password);
    }
  }
}
