import { User } from 'entities/User';
import { createUser } from 'src/user/dtos/createUser.dto';
import { Repository } from 'typeorm';
export declare class UserService {
    private UserRepository;
    constructor(UserRepository: Repository<User>);
    find(email: string): Promise<User[]>;
    create(userbody: createUser): Promise<User>;
}
