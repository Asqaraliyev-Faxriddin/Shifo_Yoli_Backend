"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = getMessages;
const verification_1 = require("../../../common/types/verification");
function getMessages(type, otp) {
    switch (type) {
        case verification_1.EverificationTypes.REGISTER:
            return `Faxriddin platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        case verification_1.EverificationTypes.RESET_PASSWORD:
            return `Faxriddin platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        case verification_1.EverificationTypes.EDIT_PHONE:
            return `Faxriddin platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }
}
//# sourceMappingURL=functions.js.map