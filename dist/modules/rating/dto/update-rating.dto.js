"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_rating_dto_1 = require("./create-rating.dto");
class UpdateReviewDto extends (0, swagger_1.PartialType)(create_rating_dto_1.CreateReviewDto) {
}
exports.UpdateReviewDto = UpdateReviewDto;
//# sourceMappingURL=update-rating.dto.js.map