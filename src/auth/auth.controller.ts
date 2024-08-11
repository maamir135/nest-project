import { BadGatewayException, BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import path from 'path';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService

    ) {

    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if(body.password !== body.password_confirm){
            throw new BadRequestException('Password do not match');
        }

        const hashed = await bcrypt.hash(body.password, 8);
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed
        });
    } 

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOne({email});

        if(!user) {
            throw new NotFoundException('User not found');
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});
        response.cookie('jwt', jwt, { httpOnly: true });

        // response.cookie('jwt', jwt);
        return user;
    }

    @UseInterceptors(ClassSerializerInterceptor)
     @Get('user')
     async user(@Req() request: Request){
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        return this.userService.findOne({id: data['id']});
     }

}
