export enum ErrorsMessages {
    INVALID_USER_ROLE = "Invalid User Role",

    USER_ROLE_TOKEN_INVALID = "User role token invalid",

    USER_ROLE_IS_NOT_MANAGER = "User role is not MANAGER",

    USER_ROLE_IS_NOT_AFFILIATE = "User role is not AFFILIATE",

    INVALID_KART_STATUS = "Invalid Kart Status",

    CORRIDA_NOT_FOUND = "Race not found",

    PROCESSING_ERROR = "PROCESSING_ERROR",

    JWT_TOKEN_IS_INVALID = "JWT Token is INVALID",

    USER_ROLE_MUST_BE_AFFILIATE_OR_MANAGER = "User role must be affiliate or manager",

    ROLE_TOKEN_NOT_FOUND_IN_JWT = "Role token not found in JWT",

    USER_ROLE_MUST_BE_MANAGER = "User role must be manager",

    CAN_NOT_UPDATE_CORRIDA_STATUS = "You can only update corrida with status CREATED",

    KART_NOT_FOUND = "Kart not found",

    KART_IS_IN_MAINTENANCE = "Kart is in maintenance",

    KART_IS_IN_RACE = "Kart is in race",

    KART_NAME_ALREADY_REGISTERED = "Kart name already registered",

    ROAD_NAME_ALREADY_REGISTERED = "Road name already registered",

    ROAD_NOT_FOUND = "Road not found",

    ENDS_AT_MUST_BE_GREATER_THAN_REGISTERED_STARTS_AT = "Ends at must be greather than registered starts at",

    INVALID_DATE_STRING_FORMAT = "Invalid date string format. It must be like day/month/year hours:minutes. Example: 30/01/2024 15:30",

    MISSING_REQUEST_BODY_DATA = "Missing request body data",

    KART_IS_NOT_AVAILABLE = "Kart is not available",

    ROAD_IS_NOT_AVAILABLE = "Road is not availabe",

    THERE_IS_A_RACE_ALREADY_CREATED_DURING_THIS_PERIOD = "There is a race already created during this period",

    had_an_schedule_during_this_period = "Has schedule in this period",

    INVALID_NAME = "Invalid name",

    MISSING_PASSWORD = "Missing password",

    USER_ALREADY_EXISTS = "User already exists",
    USER_NOT_FOUND = "User not found",
    USER_CANNOT_AUTHENTICATE = "Cannot authenticate user",

    INVALID_LOGIN_TOKEN = "Invalid session token",

    INVALID_PHONE_NUMBER = "Invalid telegram number",

    MISSING_HEADER_AUTHORIZATION_BEARER_JWT_TOKEN = "MIssing Header Authorization Bearer JWT Token",

    NAME_IS_INVALID = "Name is invalid",

    INVALID_PASSWORD = "Invalid password",
    INVALID_OLDER_PASSWORD = "Invalid older password",
    PASSWORD_IS_REQUIRED = "Password is required",
    PASSWORDS_NOT_EQUAL = "Passwords not equal",
    NEW_PASSWORD_IS_INSECURE = "New password is insecure",
    PASSWORD_INSECURE = "Password is insecure",

    RESET_PASSWORD_TOKEN_EXPIRED = "Reset password token expired",

    EMAIL_IS_INVALID = "Email is invalid",
    EMAIL_ALREADY_REGISTERED = "Email already registered",

    EMAIL_OR_PASSWORD_INVALID = "Email and/or Password Invalid",
    EMAIL_NOT_REGISTRED = "Email not registred",

    RESET_PASSWORD_TOKEN_INVALID = "Reset password token invalid",
}
