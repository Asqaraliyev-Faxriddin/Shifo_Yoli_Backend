"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymeTransactionReason = exports.PaymeTransactionState = exports.PaymeErrorCode = exports.PaymeMethods = void 0;
var PaymeMethods;
(function (PaymeMethods) {
    PaymeMethods["CheckPerformTransaction"] = "CheckPerformTransaction";
    PaymeMethods["CreateTransaction"] = "CreateTransaction";
    PaymeMethods["PerformTransaction"] = "PerformTransaction";
    PaymeMethods["CancelTransaction"] = "CancelTransaction";
    PaymeMethods["CheckTransaction"] = "CheckTransaction";
    PaymeMethods["GetStatement"] = "GetStatement";
})(PaymeMethods || (exports.PaymeMethods = PaymeMethods = {}));
var PaymeErrorCode;
(function (PaymeErrorCode) {
    PaymeErrorCode[PaymeErrorCode["NOT_POST_REQUEST"] = -32300] = "NOT_POST_REQUEST";
    PaymeErrorCode[PaymeErrorCode["INVALID_JSON"] = -32700] = "INVALID_JSON";
    PaymeErrorCode[PaymeErrorCode["REQUIRED_FIELD_NOT_FOUND"] = -32600] = "REQUIRED_FIELD_NOT_FOUND";
    PaymeErrorCode[PaymeErrorCode["INVALID_METHOD_NAME"] = -32601] = "INVALID_METHOD_NAME";
    PaymeErrorCode[PaymeErrorCode["INSUFFICIENT_PRIVILEGES"] = -32504] = "INSUFFICIENT_PRIVILEGES";
    PaymeErrorCode[PaymeErrorCode["SYSTEM_ERROR"] = -32400] = "SYSTEM_ERROR";
    PaymeErrorCode[PaymeErrorCode["INVALID_AMOUNT"] = -31001] = "INVALID_AMOUNT";
    PaymeErrorCode[PaymeErrorCode["INVALID_ACCOUNT"] = -31050] = "INVALID_ACCOUNT";
    PaymeErrorCode[PaymeErrorCode["TRANSACTION_NOT_FOUND"] = -31003] = "TRANSACTION_NOT_FOUND";
    PaymeErrorCode[PaymeErrorCode["CANNOT_PERFORM_OPERATION"] = -31008] = "CANNOT_PERFORM_OPERATION";
    PaymeErrorCode[PaymeErrorCode["CANNOT_CANCEL_TRANSACTION"] = -31007] = "CANNOT_CANCEL_TRANSACTION";
})(PaymeErrorCode || (exports.PaymeErrorCode = PaymeErrorCode = {}));
var PaymeTransactionState;
(function (PaymeTransactionState) {
    PaymeTransactionState[PaymeTransactionState["CREATED"] = 1] = "CREATED";
    PaymeTransactionState[PaymeTransactionState["COMPLETED"] = 2] = "COMPLETED";
    PaymeTransactionState[PaymeTransactionState["CANCELLED"] = -1] = "CANCELLED";
    PaymeTransactionState[PaymeTransactionState["CANCELLED_AFTER_PAYMENT"] = -2] = "CANCELLED_AFTER_PAYMENT";
})(PaymeTransactionState || (exports.PaymeTransactionState = PaymeTransactionState = {}));
var PaymeTransactionReason;
(function (PaymeTransactionReason) {
    PaymeTransactionReason[PaymeTransactionReason["RECEIVERS_INACTIVE"] = 1] = "RECEIVERS_INACTIVE";
    PaymeTransactionReason[PaymeTransactionReason["DEBIT_OPERATION_ERROR"] = 2] = "DEBIT_OPERATION_ERROR";
    PaymeTransactionReason[PaymeTransactionReason["EXECUTION_ERROR"] = 3] = "EXECUTION_ERROR";
    PaymeTransactionReason[PaymeTransactionReason["TIMEOUT"] = 4] = "TIMEOUT";
    PaymeTransactionReason[PaymeTransactionReason["REFUND"] = 5] = "REFUND";
    PaymeTransactionReason[PaymeTransactionReason["UNKNOWN_ERROR"] = 10] = "UNKNOWN_ERROR";
})(PaymeTransactionReason || (exports.PaymeTransactionReason = PaymeTransactionReason = {}));
//# sourceMappingURL=payme.js.map