import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('history')
export class History {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar'})
    name:string

    @Column({type:'jsonb'})
    data:object

    @CreateDateColumn({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    createAt:Date;

    @UpdateDateColumn({type:'timestamp', default:()=> 'CURRENT_TIMESTAMP'})
    updateAt:Date;
}
