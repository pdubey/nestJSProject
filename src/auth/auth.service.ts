import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorToken } from './actor_token.entity';
import { Actor } from '../actor/actor.entity';
import { ActorService } from '../actor/actor.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(ActorToken)
        private readonly actorTokenRepository: Repository<ActorToken>,
    ) {}

    async findUserByToken(tokenToCheck: string): Promise<Actor|null> {
        return this
        .actorTokenRepository
        .createQueryBuilder('actorToken')
        .where('actorToken.token = :token', {token: tokenToCheck})
        .getOne()
        .then((actorToken: ActorToken) => {
            return actorToken.actor;
        }, () => {
            return null;
        });
    }

    async tokenizeActor(actorToAssign: Actor, actorService: ActorService): Promise<ActorToken|null> {
        if (actorToAssign.actor_token != null) {
            return this.refreshToken(actorToAssign.actor_token);
        } else {
            const newActorToken: ActorToken = await this
            .actorTokenRepository
            .create(new ActorToken(actorToAssign));
            const toReturn: Promise<ActorToken> = this.actorTokenRepository.save(newActorToken);
            actorToAssign.actor_token = await toReturn;
            actorService.updateToken(actorToAssign);
            return toReturn;
        }
    }

    async refreshToken(existingActorToken: ActorToken): Promise<ActorToken|null> {
        existingActorToken = existingActorToken.generateUUID().generateDefaultExpiry();
        return this.actorTokenRepository.save(existingActorToken);
    }

    async validateActor(token: string): Promise<Actor> {
        return await this.findUserByToken(token);
    }
}