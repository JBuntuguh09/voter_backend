import { ActivityLog } from "src/activity-logs/entities/activity-log.entity";
import { Candidate } from "src/candidates/entities/candidate.entity";
import { Message } from "src/message/entities/message.entity";
import { Person } from "src/person/entities/person.entity";
import { Role } from "src/role/entities/role.entity";
import { Voted } from "src/voted/entities/voted.entity";
import { 
  Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, OneToOne, JoinColumn 
} from "typeorm";



@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'User_Id', type: 'int' })
  id!: number;

  @Column({ name: 'Username', unique: true, length: 50, nullable: false })
  username!: string;

  @Column({ name: 'Email', unique: true, length: 100, nullable: false })
  email!: string;

  @Column({ name: 'Password', length: 255, nullable: false, select: false })
  password!: string;

  @Column({ name: 'Level', length: 255, nullable: false, default: "Regional Coordinating Council" })
  level!: string;

  @Column({ name: 'Has_Logged_In_Before', type: 'varchar', default: "No" })
  hasLoggedInBefore!: string;

  @Column({ name: 'First_Login_Datetime', type: 'varchar', default: null, nullable: true })
  firstLoginDateTime?: string;

  @Column({ name: 'Status', type: 'varchar', length: 45, default: 'Active' })
  status!: string;

  @Column({ name: "Last_Reset_Password_Date", type: "timestamp", nullable: true, default: null })
  lastResetPasswordDate?: Date;

  @Column({ name: "Last_Reset_Password_By", type: 'varchar', length: 100, nullable: true, default: null })
  lastResetPasswordBy?: string;

  @Column({ name: "Last_Reset_Password_By_Id", type: 'int', nullable: true, default: null })
  lastResetPasswordById?: number;

  @ManyToOne(() => Person, person => person.user)
  @JoinColumn({ name: "Person_Id" })
  person!: Person;

  @ManyToOne(() => Role, role => role.user)
  @JoinColumn({ name: "Role_Id" })
  role!: Role;

   @OneToMany(() => ActivityLog, activityLog => activityLog.user)
    activityLog: ActivityLog[];
  
    @OneToMany(() => Candidate, candidate => candidate.user)
    candidate: Candidate[];
   
    @OneToMany(() => Voted, voted => voted.user)
    voted: Voted[];
   
    @OneToMany(() => Message, message => message.fromUser)
    message: Message[];

  @Column({ name: 'CreatedBy', type: 'varchar', length: 45, default: null })
  createdBy!: string;

  @Column({ name: 'UpdatedBy', type: 'varchar', length: 45, default: null })
  updatedBy!: string;

  @CreateDateColumn({ name: 'CreatedDatetime', type: 'timestamp' })
  createdDatetime!: Date;

  @UpdateDateColumn({ name: 'UpdatedDatetime', type: 'timestamp' })
  updatedDatetime!: Date;
}
