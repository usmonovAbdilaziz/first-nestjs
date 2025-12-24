import { ItemObject } from 'src/item-objects/entities/item-object.entity';
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

@Entity('sub-category')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  category_id: number;

  @Column('jsonb')
  status: { key: string }[];

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;
}
