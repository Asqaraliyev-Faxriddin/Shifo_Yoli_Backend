"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const block_guard_1 = require("./common/guards/block.guard");
const tizim_xatolilari_1 = require("./common/interceptors/tizim-xatolilari");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const bot_intervertors_1 = require("./common/interceptors/bot.intervertors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    app.useGlobalGuards(new block_guard_1.BlockGuard(new (require('@nestjs/jwt').JwtService)(), new (require('./core/prisma/prisma.service').PrismaService)()));
    app.useGlobalFilters(new tizim_xatolilari_1.AllExceptionsFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Shifo Yoli Backend")
        .setVersion("1")
        .addBearerAuth()
        .addBearerAuth()
        .build();
    app.useGlobalInterceptors(new bot_intervertors_1.TelegramInterceptor());
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.enableCors();
    let document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("swagger", app, document);
    console.log(`http://localhost:${process.env.PORT ?? 3000}/swagger`);
    console.log("Press Ctrl+C to quit.");
    await app.listen(process.env.PORT ?? 3000);
    console.log("Server is running on port ", process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map