"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingController = void 0;
const common_1 = require("@nestjs/common");
const meeting_service_1 = require("./meeting.service");
const create_meeting_dto_1 = require("./dto/create-meeting.dto");
const update_meeting_dto_1 = require("./dto/update-meeting.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../../common/guards/roles.guard");
let MeetingController = class MeetingController {
    meetingService;
    constructor(meetingService) {
        this.meetingService = meetingService;
    }
    create(dto, req) {
        return this.meetingService.create(dto, req.user.id);
    }
    findAll(req) {
        if (req.user.role === 'SUPERADMIN') {
            return this.meetingService.findAllForAdmin();
        }
        return this.meetingService.findAllForUser(req.user.id);
    }
    findOne(id, req) {
        return this.meetingService.findOne(id, req.user.id, req.user.role === 'SUPERADMIN');
    }
    update(id, dto, req) {
        return this.meetingService.update(id, dto, req.user.id, req.user.role === 'SUPERADMIN');
    }
    remove(id, req) {
        return this.meetingService.remove(id, req.user.id, req.user.role === 'SUPERADMIN');
    }
};
exports.MeetingController = MeetingController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi meeting yaratish' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Meeting muvaffaqiyatli yaratildi' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meeting_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", void 0)
], MeetingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha meetinglarni olish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meetinglar ro‘yxati' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MeetingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('one/meeting/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bitta meetingni olish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting topildi' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Meeting topilmadi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MeetingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('update/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Meetingni yangilash' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting yangilandi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_meeting_dto_1.UpdateMeetingDto, Object]),
    __metadata("design:returntype", void 0)
], MeetingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Meetingni o‘chirish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting muvaffaqiyatli o‘chirildi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MeetingController.prototype, "remove", null);
exports.MeetingController = MeetingController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Meetings'),
    (0, common_1.Controller)('meeting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [meeting_service_1.MeetingService])
], MeetingController);
//# sourceMappingURL=meeting.controller.js.map