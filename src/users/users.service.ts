import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)
        private readonly UserRepo: Repository<User>,
){}

    findByEmail(email: string){
        return this.UserRepo.findOne({ where: {email}});
    }

    findById(id: string){
        return this.UserRepo.findOne({where: {id}});
    }

    create(data: Partial<User>){
        const user = this.UserRepo.create(data);
        return this.UserRepo.save(user);
    }
}
