"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountToPenny = amountToPenny;
exports.pennyToAmount = pennyToAmount;
exports.validateWithinMinutes = validateWithinMinutes;
function amountToPenny(amount) {
    return Math.round(amount * 100);
}
function pennyToAmount(penny) {
    return penny / 100;
}
function validateWithinMinutes(date, minutes) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = diffMs / 1000 / 60;
    return diffMinutes <= minutes;
}
//# sourceMappingURL=d.js.map