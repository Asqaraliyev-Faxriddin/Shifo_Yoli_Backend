import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from "@nestjs/common";
  import { Request, Response } from "express";
  import axios from "axios";
  
  const TELEGRAM_TOKEN = "8234759100:AAGlDX_3_gTBZWc5HsMaq9uMIaVKa3XTOqM";
  const CHAT_ID = "7516576408";
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    async catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let message: any =
        exception instanceof HttpException
          ? exception.getResponse()
          : "Tizimda xatolik yuz berdi, bu xatolik to‘g‘irlanmoqda";
  
      // HttpException emas bo‘lsa → Telegramga yuboramiz
      if (!(exception instanceof HttpException)) {
        const errorMessage = `
  ❌ *Backendda xatolik:*
  📍 URL: ${request.url}
  📝 Method: ${request.method}
  👤 IP: ${request.ip}
  ---
  \`\`\`
  ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}
  \`\`\`
        `;
        try {
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
              chat_id: CHAT_ID,
              text: errorMessage,
              parse_mode: "Markdown",
            }
          );
        } catch (err) {
          console.error("Telegramga yuborilmadi:", err.message);
        }
  
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = "Tizimda xatolik yuz berdi, bu xatolik to‘g‘irlanmoqda";
      }
  
      response.status(status).json({
        statusCode: status,
        path: request.url,
        message,
      });
    }
  }
  