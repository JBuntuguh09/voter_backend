import { Candidate } from "src/candidates/entities/candidate.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn({ name: "Votes_Id", type: 'bigint' })
    id: number;

    @Column({name:"Position", type:'varchar', length:100, default:null, nullable:true})
    position:string;

    @Column({name:"Vote", type:'varchar', length:100, default:'Yes', nullable:true})
    vote:string;



    @ManyToOne(() => Candidate, (candidate) => candidate.vote)
    @JoinColumn({ name: "Candidate_Id" })
    candidate: Candidate
    
    @ManyToOne(() => Organization, (organization) => organization.voted)
    @JoinColumn({ name: "Organization_Id" })
    organization: Organization


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
