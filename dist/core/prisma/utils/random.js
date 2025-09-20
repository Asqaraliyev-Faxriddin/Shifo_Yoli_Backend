"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
function generateOtp() {
    return String(Math.floor(10000 + Math.random() * 90000));
}
//# sourceMappingURL=random.js.map