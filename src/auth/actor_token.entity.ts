import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Unique, OneToOne, JoinColumn, Column } from 'typeorm';
import { Actor } from '../actor/actor.entity';

@Entity()
@Unique(['token'])
export class ActorToken {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({length: 600})
    token: string;

    @Column('timestamp', {precision: 3})
    expires_at: Date;

    @OneToOne(type => Actor)
    @JoinColumn()
    actor: Actor;

    constructor(actor: Actor) {
        this.actor = actor;
        this.generateUUID();
        this.generateDefaultExpiry();
    }

    generateUUID(): ActorToken {
        const uid = require('uuid/v1');
        this.token = uid();
        return this;
    }

    generateDefaultExpiry(): ActorToken {
        const expiry: Date = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        this.expires_at = expiry;
        return this;
    }

    getDTO() {
        return {
            token: this.token,
            expires_at: this.expires_at,
            actor: this.actor.getDTO(),
        };
    }
}