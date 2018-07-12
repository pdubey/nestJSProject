import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('actor')
export class ActorController {

    @Post()
    create() {
        return 'this action creates and returns a new actor';
    }

    @Get()
    @UseGuards(AuthGuard('bearer'))
    findAll() {
        return 'this action returns a list of actors';
    }

}