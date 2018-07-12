import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './actor.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ActorService {

    private saltRounds: number = 10;

    constructor(
        @InjectRepository(Actor)
        private readonly actorRepository: Repository<Actor>,
    ) {}

    async findAll(): Promise<Actor[]> {
        return await this.actorRepository.find();
    }

    async findByEmail(emailToSearch: string): Promise<Actor|null> {
        return await this
        .actorRepository
        .createQueryBuilder('actor')
        .where('actor.email = :email', {email: emailToSearch})
        .getOne();
    }

    async findById(idToSearch: number): Promise<Actor|null> {
        return await this
        .actorRepository
        .createQueryBuilder('actor')
        .where('actor.id = :id', {id: idToSearch})
        .getOne();
    }

    async insert(actor: Actor): Promise<Actor|null> {
        actor.password = await this.getHash(actor.password);
        const rowToInsert: Actor = await this
        .actorRepository
        .create(actor);
        return this.actorRepository.save(rowToInsert);
    }

    async updatePassword(actor: Actor): Promise<Actor|null> {
        let actorToUpdate: Actor;
        if (actor.id != null) {
            actorToUpdate = await this.findById(actor.id);
        } else {
            actorToUpdate = await this.findByEmail(actor.email);
        }
        if (actorToUpdate != null) {
            actorToUpdate.password = actor.password;
            return this.actorRepository.save(actorToUpdate);
        }
        return null;
    }

    async updateToken(actor: Actor): Promise<Actor|null> {
        if (actor.actor_token) {
            return this.actorRepository.save(actor);
        }
        return null;
    }

    async getHash(password: string|undefined): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}