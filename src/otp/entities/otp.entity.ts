import { User } from "src/auth/entities/user.entity";
import { OTPType } from "src/common/enum/enums.enum";
import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn({name:"Otp_Id", type:'int'})
    id: number;

    @ManyToOne(()=>Person, {nullable:false})
    @JoinColumn()
    person: Person;

    @Column()
    token: string;//hashed otp for verification

    @Column({type:'enum', enum: OTPType})
    type: OTPType;

    @Column()
    expiresAt: Date;
    
    @Column({default: 0})
    repeats?: number = 0;

    @CreateDateColumn()
    createdOn: Date
}
