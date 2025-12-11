import { Building } from 'src/building/entities/building.entity';
import { Info } from '../../info/entities/info.entity';
import { ItemObject } from '../../item-objects/entities/item-object.entity';
import { Location } from '../../location/entities/location.entity';
import { CategoryNumber, CategoryStatus, StatusType } from '../../Roles/roles';
import { SubCategory } from '../../sub-category/entities/sub-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'enum', enum: StatusType })
  statusType: StatusType;

  @Column({ type: 'enum', enum: CategoryNumber })
  categoryNumber: CategoryNumber;

  @Column({ type: 'integer', default: 0 })
  moved: number;

  @Column({ type: 'enum', enum: CategoryStatus, default: CategoryStatus.New })
  status: CategoryStatus;

  @OneToMany(() => Location, (cate) => cate.category)
  locations: Location[];

  @OneToMany(()=>ItemObject,(item)=>item.category)
  objs:ItemObject[]
  
  @OneToMany(() => SubCategory, (sub) => sub.category)
  subcategories: SubCategory[];

  @Column('jsonb', { default: [] })
  history: any[];

  @OneToMany(() => Info, (info) => info.category)
  info: Info[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
