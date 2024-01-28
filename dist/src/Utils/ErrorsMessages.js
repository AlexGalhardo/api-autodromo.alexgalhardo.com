"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsMessages = void 0;
var ErrorsMessages;
(function (ErrorsMessages) {
    ErrorsMessages["INVALID_USER_ROLE"] = "Invalid User Role";
    ErrorsMessages["USER_ROLE_TOKEN_INVALID"] = "User role token invalid";
    ErrorsMessages["USER_ROLE_IS_NOT_GESTOR"] = "User role is not GESTOR";
    ErrorsMessages["USER_ROLE_IS_NOT_AFILIADO"] = "User role is not AFILIADO";
    ErrorsMessages["INVALID_KART_STATUS"] = "Invalid Kart Status";
    ErrorsMessages["CORRIDA_NOT_FOUND"] = "Corrida not found";
    ErrorsMessages["PROCESSING_ERROR"] = "PROCESSING_ERROR";
    ErrorsMessages["JWT_TOKEN_IS_INVALID"] = "JWT Token is INVALID";
    ErrorsMessages["CAN_NOT_UPDATE_CORRIDA_STATUS"] = "You can only update corrida with status CREATED";
    ErrorsMessages["KART_NOT_FOUND"] = "Kart not found";
    ErrorsMessages["KART_NAME_ALREADY_REGISTERED"] = "Kart name already registered";
    ErrorsMessages["PISTA_NAME_ALREADY_REGISTERED"] = "Pista name already registered";
    ErrorsMessages["PISTA_NOT_FOUND"] = "Pista not found";
    ErrorsMessages["ENDS_AT_MUST_BE_GREATER_THAN_REGISTERED_STARTS_AT"] = "Ends at must be greather than registered starts at";
    ErrorsMessages["INVALID_DATE_STRING_FORMAT"] = "Invalid date string format. It must be like day/month/year hours:minutes. Example: 30/01/2024 15:30";
    ErrorsMessages["MISSING_REQUEST_BODY_DATA"] = "Missing request body data";
    ErrorsMessages["KART_IS_NOT_AVAILABLE"] = "Kart is not available";
    ErrorsMessages["THERE_IS_A_RACE_ALREADY_CREATED_DURING_THIS_PERIOD"] = "There is a race already created during this period";
    ErrorsMessages["had_an_agendamento_during_this_period"] = "Has agendamento in this period";
    ErrorsMessages["INVALID_NAME"] = "Invalid name";
    ErrorsMessages["MISSING_PASSWORD"] = "Missing password";
    ErrorsMessages["USER_ALREADY_EXISTS"] = "User already exists";
    ErrorsMessages["USER_NOT_FOUND"] = "User not found";
    ErrorsMessages["USER_CANNOT_AUTHENTICATE"] = "Cannot authenticate user";
    ErrorsMessages["INVALID_LOGIN_TOKEN"] = "Invalid session token";
    ErrorsMessages["INVALID_PHONE_NUMBER"] = "Invalid telegram number";
    ErrorsMessages["MISSING_HEADER_AUTHORIZATION_BEARER_JWT_TOKEN"] = "MIssing Header Authorization Bearer JWT Token";
    ErrorsMessages["NAME_IS_INVALID"] = "Name is invalid";
    ErrorsMessages["INVALID_PASSWORD"] = "Invalid password";
    ErrorsMessages["INVALID_OLDER_PASSWORD"] = "Invalid older password";
    ErrorsMessages["PASSWORD_IS_REQUIRED"] = "Password is required";
    ErrorsMessages["PASSWORDS_NOT_EQUAL"] = "Passwords not equal";
    ErrorsMessages["NEW_PASSWORD_IS_INSECURE"] = "New password is insecure";
    ErrorsMessages["PASSWORD_INSECURE"] = "Password is insecure";
    ErrorsMessages["RESET_PASSWORD_TOKEN_EXPIRED"] = "Reset password token expired";
    ErrorsMessages["EMAIL_IS_INVALID"] = "Email is invalid";
    ErrorsMessages["EMAIL_ALREADY_REGISTERED"] = "Email already registered";
    ErrorsMessages["EMAIL_OR_PASSWORD_INVALID"] = "Email and/or Password Invalid";
    ErrorsMessages["EMAIL_NOT_REGISTRED"] = "Email not registred";
    ErrorsMessages["RESET_PASSWORD_TOKEN_INVALID"] = "Reset password token invalid";
})(ErrorsMessages || (exports.ErrorsMessages = ErrorsMessages = {}));
//# sourceMappingURL=ErrorsMessages.js.map