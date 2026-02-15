import { Candidate } from "src/candidates/entities/candidate.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Images {
    @PrimaryGeneratedColumn({name:'Image_Id', type:'int'})
    id: number

    @Column({name:'Url', type:'text', nullable:true})
    url?:string;

    @Column({name:'Base64', type:'text', nullable:true})
    base64?:string;
    
    
    @Column({name:'Public_Id', type:'varchar', length:300, nullable:true})
    publicId?:string;
    

    @Column({ name: 'Status', type: 'varchar', length: 45, default:"Active" })
    status?: string;

    @Column({ name: 'CreatedBy', type: 'varchar', length: 45 , default: null})
    createdBy?: string;

    @Column({ name: 'UpdatedBy', type: 'varchar', length: 45, default: null })
    updatedBy?: string;

    @CreateDateColumn({ name: 'CreatedDatetime', type: 'timestamp' })
    createdDatetime: Date;

    @UpdateDateColumn({ name: 'UpdatedDatetime', type: 'timestamp' })
    updatedDatetime: Date;

    // ✅ Correct inverse relation
    @OneToMany(() => Person, person => person.image)
    person?: Person[];

     @OneToMany(() => Candidate, candidate => candidate.image)
        candidate: Candidate[];

    // @OneToMany(() => Approval, appoval => appoval.signature)
    // approval?: Approval[];

    
}