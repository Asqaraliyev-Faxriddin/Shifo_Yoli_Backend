import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { BlockGuard } from './common/guards/block.guard';
import { AllExceptionsFilter } from './common/interceptors/tizim-xatolilari';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,    
    forbidNonWhitelisted:true,
    transform:true
  }))

  app.useGlobalGuards(new BlockGuard(new (require('@nestjs/jwt').JwtService)(),new (require('./core/prisma/prisma.service').PrismaService)()))
  app.useGlobalFilters(new AllExceptionsFilter());


  const config = new DocumentBuilder()
  .setTitle("Shifo Yoli Backend")
  .setVersion("1")
  .addBearerAuth()
  .addBearerAuth()
  .build()
  

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors()


  let document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("swagger",app,document)
  
   
   
  console.log(`http://localhost:${process.env.PORT ?? 3000}/swagger`);
  
  console.log("Press Ctrl+C to quit.");
   
  await app.listen(process.env.PORT ?? 3000);
  console.log("Server is running on port ",process.env.PORT ?? 3000);
  

  


}
bootstrap();
