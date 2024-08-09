import { Body, Controller, Post } from '@nestjs/common';
import path from 'path';

@Controller('auth')
export class AuthController {

    @Post('register')
    async register(@Body() body) {
        return body;
    } 

}
