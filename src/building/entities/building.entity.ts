import { Location } from 'src/location/entities/location.entity';
import { BuildingName } from '../../Roles/roles';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('building')
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: BuildingName })
  name: BuildingName;

  @Column({ type: 'integer' })
  floors: number;

  @Column({ type: 'integer' })
  rooms: number;

  @Column({ type: 'integer' })
  showcase: number;

  @Column({ type: 'integer' })
  polkas: number;

  @Column({ type: 'varchar', nullable: true })
  oldBuilding?: string;

  @OneToMany(() => Location, (location) => location.building)
  locations: Location[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
