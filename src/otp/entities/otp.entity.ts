import { User } from "src/auth/entities/user.entity";
import { OTPType } from "src/common/enum/enums.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class Otp {
    @PrimaryGeneratedColumn({name:"Otp_Id", type:'int'})
    id: number;

    @ManyToOne(()=>User, {nullable:false})
    @JoinColumn()
    user: User;

    @Column()
    token: string;//hashed otp for verification

    @Column({type:'enum', enum: OTPType})
    type: OTPType;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdOn: Date
}
