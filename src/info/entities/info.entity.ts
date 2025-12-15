import { Reason } from 'src/Roles/roles';
import { Category } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('info')
export class Info {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  category_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'enum', enum: Reason, nullable: true })
  reasonForTransfer: Reason;

  @Column({ type: 'jsonb', default: [] })
  home: { data: object }[];

  @ManyToOne(() => Category, (category) => category.info, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

