

import { User } from "src/auth/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Index(['messageStatus'])
@Index(['priority'])
@Index(['isRead'])
@Index(['createdDatetime'])

@Entity()
export class Message {

    @PrimaryGeneratedColumn({name:"Message_Id", type:'bigint'})
    id: number;

    @Column({name: "Title", type: "varchar", length:100, default:null, nullable:true})
    titles: string;

    @Column({name: "Message", type: "text", default:null, nullable:true})
    message: string;

    @Column({name: "Message_Type", type:'varchar', length:50, nullable:true })
    messageType: string;

    @Column({name: "Message_Status", type:'varchar', length:50, nullable:true, default: 'Successful' })
    messageStatus: string;


    @ManyToOne(()=> User, (user)=> user.message, { onDelete:'CASCADE', nullable:true})
    @JoinColumn({name: 'From_User_Id'})
    fromUser: User;

    @Column({name: "Recipient_Name", type:'varchar', length:'100', nullable: true})
    recipientName: string;
      
    @Column({name: "Recipient_Address", type:'varchar', length:'100', nullable: true})
    recipientAddress: string;
    
    @Column({name: "Details", type:'text', nullable: true})
    details: string;

    @Column({ name: 'Is_Read', type: 'boolean', default: false })
    isRead: boolean;

    @Column({ name: 'Read_At', type: 'timestamp', nullable: true })
    readAt: Date;

    @Column({ name: 'Priority', type: 'varchar', length: 20, default: 'Normal' })
    priority: string; // Low | Normal | High | Urgent

    @Column({ name: 'Channel', type: 'varchar', length: 20, default: 'System' })
    channel: string; // System | Email | SMS | Push

    @Column({ name: 'Reference_Type', type: 'varchar', length: 100, nullable: true })
    referenceType: string; // Link to permit, invoice, property, etc
    
    @Column({ name: 'Reference_Id', type: 'varchar', length: 100, nullable: true })
    referenceId: string; // Link to permit, invoice, property, etc

        
    @ManyToOne(()=> Organization, (organization)=> organization.message, { onDelete:'CASCADE', nullable:true})
    @JoinColumn({name: 'Organization_Id'})
    organization: Organization;


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
