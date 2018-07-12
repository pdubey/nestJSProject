import { Entity, Unique, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import {IsEmail} from 'class-validator';
import { ActorToken } from '../auth/actor_token.entity';

@Entity()
@Unique(['email'])
export class Actor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200, nullable: true})
    first_name: string;

    @Column({length: 200, nullable: true})
    middle_name: string;

    @Column({length: 200, nullable: true})
    last_name: string;

    @PrimaryColumn({length: 500})
    @IsEmail()
    email: string;

    @Column({length: 500, nullable: true})
    password: string|undefined;

    @OneToOne(type => ActorToken)
    @JoinColumn()
    actor_token: ActorToken;

    @Column('timestamp', { precision: 3, default: () => 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)'})
    updated_at: Date;

    @Column('timestamp', { precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
    created_at: Date;

    getDTO() {
        return {
            id: this.id,
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.middle_name,
            email: this.email,
            updated_at: this.updated_at,
            created_at: this.created_at,
        };
    }
}