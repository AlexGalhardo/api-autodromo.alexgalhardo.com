"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const crypto_1 = require("crypto");
const Bcrypt_1 = require("../Utils/Bcrypt");
const ErrorsMessages_1 = require("../Utils/ErrorsMessages");
const Exception_1 = require("../Utils/Exception");
const Validator_1 = require("../Utils/Validator");
const jwt = require("jsonwebtoken");
class AuthRegisterUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(UserCreateDTO) {
        const { username, email, password } = UserCreateDTO;
        if (email && !Validator_1.default.email.isValid(email))
            throw new Exception_1.ClientException(ErrorsMessages_1.ErrorsMessages.EMAIL_IS_INVALID);
        if (password && !Validator_1.default.password.isSecure(password))
            throw new Exception_1.ClientException(ErrorsMessages_1.ErrorsMessages.PASSWORD_INSECURE);
        const hashedPassword = await Bcrypt_1.Bcrypt.hash(password);
        if (!(await this.usersRepository.findByEmail(email))) {
            const userId = (0, crypto_1.randomUUID)();
            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);
            await this.usersRepository.create({
                id: userId,
                username,
                email,
                password: hashedPassword,
                jwt_token,
                reset_password_token: null,
                reset_password_token_expires_at: null,
            });
            return { success: true, jwt_token };
        }
        throw new Exception_1.ClientException(ErrorsMessages_1.ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
exports.default = AuthRegisterUseCase;
//# sourceMappingURL=AuthRegister.useCase.js.map