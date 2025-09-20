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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let SeaderService = class SeaderService {
    prisma;
    loger = new common_1.Logger("Seader");
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.CreateSuperadmin();
    }
    async CreateSuperadmin() {
        let password = await bcrypt.hash("11201111", 10);
        await this.prisma.user.createMany({
            data: [
                {
                    firstName: 'Faxriddin',
                    lastName: "Asqaraliyev",
                    age: 15,
                    email: 'asqaraliyevfaxriddin2011@gmail.com',
                    role: client_1.UserRole.ADMIN,
                    password
                },
                {
                    firstName: 'Biror',
                    lastName: "Kim",
                    age: 25,
                    email: 'asqaraliyevfaxriddin2009@gmail.com',
                    role: client_1.UserRole.DOCTOR,
                    password
                },
                {
                    firstName: 'Men',
                    lastName: "Sen",
                    age: 24,
                    email: 'asqaraliyevfaxriddin44@gmail.com',
                    role: client_1.UserRole.SUPERADMIN,
                    password
                },
                {
                    firstName: 'Men',
                    lastName: "Sen",
                    age: 24,
                    email: 'asqaraliyevfaxriddin9876@gmail.com',
                    role: client_1.UserRole.BEMOR,
                    password
                },
            ],
            skipDuplicates: true,
        });
        this.loger.log("Admin ,Sotuvchi va Xaridor yaratildi.");
    }
};
exports.SeaderService = SeaderService;
exports.SeaderService = SeaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeaderService);
//# sourceMappingURL=seader.service.js.map