import { User } from "src/auth/entities/user.entity";
import { Images } from "src/images/entities/image.entity";
import { Organization } from "src/organization/entities/organization.entity";

import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Person  {
    @PrimaryGeneratedColumn({ name: 'Person_Id', type: 'int' })
    id: number;

    @Column({ name: 'PersonCode', type: 'varchar', length: 50, nullable: true, default: null })
    code?: string;

    @Column({ name: 'FirstName', type: 'varchar', length: 100, nullable: false })
    firstName: string;

    @Column({ name: 'LastName', type: 'varchar', length: 100, nullable: false })
    lastName: string;

    @Column({ name: 'Email', type: 'varchar', length: 150, unique: true, nullable: false })
    email: string;

    @Column({ name: 'PhoneNumber', type: 'varchar', length: 15, unique: true, nullable: true })
    phoneNumber: string;

    @OneToMany(() => User, user => user.person)
    user: User[];

    @ManyToOne(() => Organization, assembly=> assembly.person, { nullable: true })
    @JoinColumn({name:"Organization_Id"})
    organization?: Organization;

     @ManyToOne(() => Images , images => images.person, { nullable: true })
    image?: Images;


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