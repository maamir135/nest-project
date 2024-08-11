import { Body, Controller, Post } from '@nestjs/common';
import path from 'path';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {

    constructor(private userService: UserService) {

    }

    @Post('register')
    async register(@Body() body) {
        const hashed = bcrypt.hash(body.password,12);
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,

        });
    } 

}
