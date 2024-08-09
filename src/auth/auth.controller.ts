import { Body, Controller, Post } from '@nestjs/common';
import path from 'path';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {

    constructor(private userService: UserService) {

    }

    @Post('register')
    async register(@Body() body) {
        return this.userService.create(body);
    } 

}
