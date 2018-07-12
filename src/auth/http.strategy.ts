import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Actor } from 'actor/actor.entity';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super();
    }

    // tslint:disable-next-line:ban-types
    async validate(token: string, done: Function) {
        const actor = this.authService.validateActor(token);
        if (!actor) {
            return done(new UnauthorizedException(), false);
        } else {
            done(null, actor);
        }
    }
}