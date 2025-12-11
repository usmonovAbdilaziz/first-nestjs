import { Building } from 'src/building/entities/building.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  floor: number;

  @Column({ type: 'integer' })
  room: number;

  @Column({ type: 'integer' })
  showcase: number;

  @Column({ type: 'integer' })
  polka: number;

  @Column({ type: 'integer' })
  building_id: number;


  @Column({ type: 'integer' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.locations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Building, (building) => building.locations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
    nullable: true,
  })
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
