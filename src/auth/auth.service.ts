import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    prisma = new PrismaClient();
    constructor(private jwtservice: JwtService) { }
    async loginOrRegister(email: string, password: string) {
        //check if user exists with this email
        let user = await this.prisma.user.findUnique({
            where: { email }
        })
        try {

            if (user) {
                //user exists -> login
                const match = await bcryptjs.compare(password, user.password);
                if (!match) {
                    throw new BadRequestException("Invalid Credentials")
                }
                //if match -> generate token
                const token = await this.jwtservice.signAsync({ sub: user.id, roleId: user.roleId, organizationId: user.organizationId })
                return { user, access_token: token, isNewUser: false }
            }
            //if user does not exists -> register autoatically
            const hashed = await bcryptjs.hash(password, 10)

            user = await this.prisma.user.create({
                data: { email, password: hashed, roleId: null, organizationId: null }
            })
            //return token for new user 
            const token = await this.jwtservice.sign({ sub: user.id })
            return { user, acces_token: token, isNewUser: true }

        } catch (error) {
            console.error('[AuthService Error]', error); 
            if (error instanceof BadRequestException){
                throw error
            }
            throw new InternalServerErrorException({
                message: 'Something went wrong, please try again later',
                code: 'INTERNAL_ERROR',
              });
        }


    }

}
