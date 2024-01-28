"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_URL = void 0;
exports.APP_URL = process.env.NODE_ENV === "development" ? process.env.APP_FRONT_URL_DEV : process.env.APP_FRONT_URL_PROD;
//# sourceMappingURL=Constants.js.map