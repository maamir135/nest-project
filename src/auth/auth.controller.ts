import { BadGatewayException, BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import path from 'path';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { response, Response } from 'express';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
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
            password: hashed,
            role: {id: 1}
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
    @UseGuards(AuthGuard)
     @Get('user')
     async user(@Req() request: Request){
        const id = await this.authService.userId(request);
        return this.userService.findOne({id});
     }

    @UseGuards(AuthGuard)
     @Post('logout')
     async logout(@Res({passthrough: true}) response: Response){
        response.clearCookie('jwt');
        return {
            message: 'Successfully logout'
        }
     }

}
