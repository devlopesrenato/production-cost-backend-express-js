const bcrypt = require('bcryptjs')
const AuthMiddleware = require('../AuthMiddleware');
const UsersRepository = require('./users.repository');
const NotFoundError = require('../common/errors/types/NotFoundError');
const UnauthorizedError = require('../common/errors/types/UnauthorizedError');

class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository();
        this.auth = new AuthMiddleware()
    }

    async login(loginDto) {
        const user = await this.usersRepository.getByNickName(loginDto.user);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        await this.checkPassword(loginDto.password, user);

        const token = this.auth.createJTW({ id: user.uuid })
        return {
            name: user.name,
            id: user.uuid,
            token
        }
    }

    async validtoken(uuid) {
        const user = await this.usersRepository.getById(uuid);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return { ...user, pass: undefined };
    }

    async update(uuid, updateUserDto) {
        const user = await this.usersRepository.getById(uuid);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        await this.checkPassword(updateUserDto.pass, user);

        let updateUser = {
            ...updateUserDto,
            newpass: updateUserDto.newpass
                ? await this.createHashedPassword(updateUserDto.newpass)
                : undefined
        };

        return this.usersRepository.update(uuid, updateUser);
    }


    async checkPassword(pass, user) {
        const match = await bcrypt.compare(pass, user.pass);
        if (!match) {
            throw new UnauthorizedError('Invalid Credentials');
        }
        return match;
    }

    async createHashedPassword(pass) {
        const saltRounds = await bcrypt
            .genSalt(Number(process.env.SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        return hashedPassword;
    }
}

module.exports = UsersService;