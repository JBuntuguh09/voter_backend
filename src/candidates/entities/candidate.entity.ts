import { User } from "src/auth/entities/user.entity";
import { Images } from "src/images/entities/image.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Vote } from "src/votes/entities/vote.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn({name:'Candidate_Id', type:'int'})
    id: number

    
        @Column({ name: 'Candidate_Code', type: 'varchar', length: 50, nullable: true, default: null })
        code?: string;
    
        @Column({ name: 'First_Name', type: 'varchar', length: 100, nullable: false })
        firstName: string;
    
        @Column({ name: 'Last_Name', type: 'varchar', length: 100, nullable: false })
        lastName: string;
    
        @Column({ name: 'Email', type: 'varchar', length: 150, nullable: true })
        email?: string;
    
        @Column({ name: 'PhoneNumber', type: 'varchar', length: 15, nullable: true })
        phoneNumber?: string;
        
        @Column({ name: 'Position', type: 'varchar', length: 100, nullable: true })
        position?: string;
    
        @ManyToOne(() => User, user => user.candidate, { nullable: true, onDelete:'CASCADE'})
        @JoinColumn({name: 'User_Id'})
        user?: User;
    
        @ManyToOne(() => Organization, assembly=> assembly.candidate, { nullable: true, onDelete:'CASCADE' })
        @JoinColumn({name:"Organization_Id"})
        organization?: Organization;
    
         @ManyToOne(() => Images , images => images.candidate, { nullable: true, onDelete:'CASCADE' })
         @JoinColumn({name:'Image_Id'})
        image?: Images;

        @OneToMany(() => Vote, vote => vote.candidate)
        vote: Vote[];
    
    
        @Column({ name: 'Status', type: 'varchar', length: 45, default: 'Active' })
        status: string;
    
        @Column({ name: 'CreatedBy', type: 'varchar', length: 45, default: null })
        createdBy: string;
    
        @Column({ name: 'UpdatedBy', type: 'varchar', length: 45, default: null })
        updatedBy: string;
    
        @CreateDateColumn({ name: 'CreatedDatetime', type: 'timestamp'})
        createdDatetime: Date;
    
        @UpdateDateColumn({ name: 'UpdatedDatetime', type: 'timestamp'})
        updatedDatetime: Date;
}
