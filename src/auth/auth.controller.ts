import { Controller, Post, Response, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActorService } from '../actor/actor.service';
import { Actor } from '../actor/actor.entity';
import { ActorToken } from './actor_token.entity';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly actorService: ActorService,
    ) {}

    @Post('register')
    async register(@Response() response: any, @Body() body: Actor) {
        if (!(body && body.email && body.password)) {
            return response.status(HttpStatus.FORBIDDEN).json({message: 'Email & Password are required'});
        } else {
            let actor: Actor = await this.actorService.findByEmail(body.email);
            if (actor) {
                return response.status(HttpStatus.FORBIDDEN).json({message: 'Email already in use'});
            } else {
                actor = await this.actorService.insert(body);
                return response.status(HttpStatus.OK).json(actor.getDTO());
            }
        }
    }

    @Post('login')
    async login(@Response() response: any, @Body() body: Actor) {
        if (!(body && body.email && body.password)) {
            return response.status(HttpStatus.FORBIDDEN).json({message: 'Email & Password are required'});
        } else {
            const actor: Actor = await this.actorService.findByEmail(body.email);
            if (actor) {
                if (this.actorService.compareHash(body.password, actor.password)) {
                    const actorToken: ActorToken = await this.authService.tokenizeActor(actor, this.actorService);
                    return response.status(HttpStatus.OK).json(actorToken.getDTO());
                } else {
                    return response.status(HttpStatus.FORBIDDEN).json({message: 'Invalid Password'});
                }
            } else {
                return response.status(HttpStatus.FORBIDDEN).json({message: 'Invalid Email'});
            }
        }
    }

}