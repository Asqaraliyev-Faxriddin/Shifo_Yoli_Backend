"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshToken = exports.JwtAccesToken = void 0;
exports.JwtAccesToken = {
    secret: process.env.Jwt_Acc,
    expiresIn: process.env.Jwt_Acc_in
};
exports.JwtRefreshToken = {
    secret: process.env.Jwt_Ref,
    expiresIn: process.env.Jwt_Ref_in
};
//# sourceMappingURL=jwt.js.map