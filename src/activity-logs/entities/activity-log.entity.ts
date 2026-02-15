
import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ActivityLog {
    @PrimaryGeneratedColumn({ name: 'Activity_Log_Id', type: 'bigint' })
    id: number;

    @Column({ name: 'Action', type: 'text', nullable: true })
    action: string;
    @Column({ name: 'Url', type: 'text', nullable: true })
    url: string;
    @Column({ name: 'Method', type: 'varchar', length: 100, nullable: true })
    method: string;
    @Column({ name: 'User-Agent', type: 'varchar', length: 400, nullable: true })
    userAgent: string;
    
    @Column({ name: 'Status-Code', type: 'varchar', length: 100, nullable: true })
    statusCode: string;

    @Column({ name: 'Ip_Address', type: 'varchar', length: 45, nullable: true })
    ipAddress: string;

    @Column({ name: 'Route', type: 'varchar', length: 300, nullable: true })
    route: string;

    @Column({ name: 'Result', type: 'varchar', nullable: true })//success or failure
    result: string;
    
    @Column({ name: 'Response_Time', type: 'varchar', length:20, nullable: true })
    responseTime: string;

    @ManyToOne(() => User, (user) => user.activityLog)
    @JoinColumn({ name: 'User_Id' })
    user: User;

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
