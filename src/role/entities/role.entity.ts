import { User } from "src/auth/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";

import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class Role{
    @PrimaryGeneratedColumn({name:'Role_Id', type:'int'})
    id: number;

    @Column({name:'Name', type:'varchar', length:'100', default:null, nullable:false})
    name: string;

    @Column({name:'Description', type:'text', nullable:true, default:null})
    description:string;

    @OneToMany(()=>User, (user)=>user.role)
    user: User[];
    
    // @OneToMany(()=>Permission, (permission)=>permission.role)
    // permission: Permission[];

    @ManyToOne(()=>Organization, (organization)=>organization.role)
    @JoinColumn({name:"Organization_Id"})
    organization:Organization

     @Column({ name: 'Status', type: 'varchar', length: 45, default: 'Active' })
    status: string;

    @Column({ name: 'CreatedBy', type: 'varchar', length: 45, default: null })
        createdBy: string;
    
    @Column({ name: 'UpdatedBy', type: 'varchar', length: 45, default: null })
        updatedBy: string;
    
    @CreateDateColumn({ name: 'CreatedDatetime', type: 'timestamp' })
    createdDatetime: Date;
    
    @UpdateDateColumn({ name: 'UpdatedDatetime', type: 'timestamp' })
    updatedDatetime: Date;



}