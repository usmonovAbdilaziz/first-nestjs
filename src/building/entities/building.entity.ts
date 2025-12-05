import { Category } from 'src/category/entities/category.entity';
import { BuildingName } from '../../Roles/roles';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('building')
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: BuildingName })
  name: BuildingName;

  @Column({ type: 'integer' })
  floors: number;

  @Column({ type: 'integer' })
  category_id: number;

 
   @ManyToOne(() => Category, (category) => category.bulds, {
     onDelete: 'CASCADE',
     onUpdate: 'CASCADE', // Category o‘chsa ItemObjectlar ham o‘chadi
     nullable: true,
   })
   @JoinColumn({ name: 'category_id' })
   category: Category;

  @Column({ type: 'integer' })
  rooms: number;

  @Column({ type: 'integer' })
  showcase: number;

  @Column({ type: 'integer' })
  polka: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
