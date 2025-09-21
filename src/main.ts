import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,    
    forbidNonWhitelisted:true
  }))


  const config = new DocumentBuilder()
  .setTitle("Learning-Management-System")
  .setVersion("1")
  .addBearerAuth()
  .addBearerAuth()
  .build()
  


  app.enableCors()


  let document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("swagger",app,document)
  
   
   
  console.log(`http://localhost:${process.env.PORT ?? 3000}/swagger`);
  
  console.log("Press Ctrl+C to quit.");
  
  await app.listen(process.env.PORT ?? 3000);
  console.log("Server is running on port ",process.env.PORT ?? 3000);
  

  


}
bootstrap();
