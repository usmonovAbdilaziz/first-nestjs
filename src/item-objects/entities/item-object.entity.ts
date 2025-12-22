import { SubCategory } from 'src/sub-category/entities/sub-category.entity';
import { Category } from '../../category/entities/category.entity';
import { CategoryStatus, FondType, ItemStatus } from '../../Roles/roles';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('item-objects')
export class ItemObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  category_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  period: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  moved: number;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ type: 'varchar' })
  material: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: CategoryStatus, default: CategoryStatus.New })
  statusCategory: CategoryStatus;

  @Column({ type: 'enum', enum: ItemStatus })
  status: ItemStatus;

  @Column({ type: 'enum', enum: FondType })
  fondType: FondType;

  @ManyToOne(() => Category, (category) => category.objs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', nullable: true })
  subCategory: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
