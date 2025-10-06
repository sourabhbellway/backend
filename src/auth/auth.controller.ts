import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from "./auth.service"
import { LoginRegisterDto } from './dto/login-register-dto';

@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService) {}
    @Post('loginOrRegister')
    @UsePipes(new ValidationPipe ({whitelist:true ,forbidNonWhitelisted:true}))
    async login(@Body() body:LoginRegisterDto){
        return this.authservice.loginOrRegister(body.email,body.password)
    }
}

