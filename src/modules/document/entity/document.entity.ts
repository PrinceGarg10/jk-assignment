import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { DocumentStatus } from '../../common/constants/document-status';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  filePath: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'last_updated_by' })
  lastUpdatedBy: UserEntity;

  @Column({
    type: 'enum',
    enum: Object.values(DocumentStatus),
    default: DocumentStatus.PENDING
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  statusMessage: string;
}
