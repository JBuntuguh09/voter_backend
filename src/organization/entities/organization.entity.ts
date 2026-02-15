import { Candidate } from "src/candidates/entities/candidate.entity";
import { Message } from "src/message/entities/message.entity";
import { Person } from "src/person/entities/person.entity";
import { Role } from "src/role/entities/role.entity";
import { Voted } from "src/voted/entities/voted.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn({name:'Organization_Id'})
    id: number;

    @Column({name:'Name', type:'varchar', length:300, nullable:false})
    name: string;
    
    @Column({name:'Description', type:'text', nullable:true, default: null})
    description: string;

    
    @Column({name:'Election_Start_Date', type:'timestamp', nullable:true, default: null})
    electionStartDate: Date;

    @Column({name:'Election_Start_Time', type:'varchar',length:10, nullable:true, default: null})
    electionStartTime: string;
    
    @Column({name:'Election_End_Date', type:'timestamp', nullable:true, default: null})
    electionEndDate: Date;

    @Column({name:'Election_End_Time', type:'varchar',length:10, nullable:true, default: null})
    electionEndTime: string;



    @OneToMany(() => Person, person => person.organization)
    person: Person[];
    
    @OneToMany(() => Role, role => role.organization)
    role: Role[];
   
    @OneToMany(() => Voted, voted => voted.organization)
    voted: Voted[];
    

     @OneToMany(() => Candidate, candidate => candidate.organization)
        candidate: Candidate[];
    
    @OneToMany(() => Message, message => message.organization)
    message: Message[];

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
