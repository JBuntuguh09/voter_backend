import { User } from "src/auth/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Voted {
    @PrimaryGeneratedColumn({name:"Voted_Id", type:'bigint'})
    id: number;

    @Column({name:"Position", type:'varchar', length:100, default:null, nullable:true})
    position:string;


    @ManyToOne(()=>User, (user)=>user.voted)
    @JoinColumn({name:"User_Id"})
    user:User

    @ManyToOne(()=>Organization, (organization)=>organization.voted)
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
