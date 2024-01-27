"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const crypto_1 = require("crypto");
const Bcrypt_1 = require("../Utils/Bcrypt");
const ErrorsMessages_1 = require("../Utils/ErrorsMessages");
const Validator_1 = require("../Utils/Validator");
const jwt = require("jsonwebtoken");
const client_1 = require("@prisma/client");
class AuthRegisterUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(jwtToken, userCreatePayload) {
        try {
            const { role_token } = jwt.verify(jwtToken, process.env.JWT_SECRET);
            if (!role_token)
                throw new Error(ErrorsMessages_1.ErrorsMessages.USER_ROLE_TOKEN_INVALID);
            const userFound = await this.usersRepository.getByRoleToken(role_token);
            if (userFound && userFound.role !== client_1.UserRole.GESTOR)
                throw new Error(ErrorsMessages_1.ErrorsMessages.USER_ROLE_IS_NOT_GESTOR);
            const { username, email, password, role } = userCreatePayload;
            if (email && !Validator_1.default.email.isValid(email))
                throw new Error(ErrorsMessages_1.ErrorsMessages.EMAIL_IS_INVALID);
            if (password && !Validator_1.default.password.isSecure(password))
                throw new Error(ErrorsMessages_1.ErrorsMessages.PASSWORD_INSECURE);
            if (role && !Validator_1.default.role.isValid(role))
                throw new Error(ErrorsMessages_1.ErrorsMessages.INVALID_USER_ROLE);
            if (!(await this.usersRepository.findByEmail(email))) {
                const role_token = (0, crypto_1.randomUUID)();
                const jwt_token = jwt.sign({ role_token }, process.env.JWT_SECRET);
                await this.usersRepository.create({
                    username,
                    role,
                    role_token,
                    email,
                    password: await Bcrypt_1.Bcrypt.hash(password),
                    jwt_token,
                    reset_password_token: null,
                    reset_password_token_expires_at: null,
                });
                return { success: true, jwt_token };
            }
            throw new Error(ErrorsMessages_1.ErrorsMessages.EMAIL_ALREADY_REGISTERED);
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = AuthRegisterUseCase;
//# sourceMappingURL=AuthRegister.useCase.js.map