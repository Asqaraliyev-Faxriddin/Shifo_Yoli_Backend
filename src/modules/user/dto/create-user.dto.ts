    import { 
        IsEmail, 
        IsEnum, 
        IsNotEmpty, 
        IsOptional, 
        IsString, 
        MinLength, 
        IsUUID 
    } from 'class-validator';
    import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
    
    export enum UserType {
        BUY = 'BUY',
        SELL = 'SELL',
        ADMIN = 'ADMIN',
    }
    
    
    export class CreateAdminDto {
        @ApiProperty({ example: 'Ali' })
        @IsString()
        @IsNotEmpty()
        firstName: string;
    
        @ApiProperty({ example: 'Valiyev' })
        @IsString()
        @IsNotEmpty()
        lastName: string;
    
        @ApiProperty({ example: 'admin@example.com' })
        @IsEmail()
        email: string;
    
        @ApiProperty({ example: 'strongPassword123' })
        @IsString()
        @MinLength(6)
        password: string;

        @ApiPropertyOptional({
            type: 'string',
            format: 'binary',
            description: 'Profil rasmi (optional, file sifatida yuboriladi)',
          })
          @IsOptional()
          profileImg?: Express.Multer.File;
        

        
    }
    
    
    export class CreateSellerDto {
        @ApiProperty({ example: 'Ali' })
        @IsString()
        firstName: string;
    
        @ApiProperty({ example: 'Valiyev' })
        @IsString()
        lastName: string;
    
        @ApiProperty({ example: 'seller@example.com' })
        @IsEmail()
        email: string;
    
        @ApiProperty({ example: 'sellerPassword123' })
        @IsString()
        @MinLength(6)
        password: any;
    
        @ApiPropertyOptional({
            type: 'string',
            format: 'binary',
            description: 'Profil rasmi (optional, file sifatida yuboriladi)',
          })
          @IsOptional()
          profileImg?: Express.Multer.File;
        
    }
    
    
    export class CreateBuyerDto {
        @ApiProperty({ example: 'Ali' })
        @IsString()
        firstName: string;
    
        @ApiProperty({ example: 'Valiyev' })
        @IsString()
        lastName: string;
    
        @ApiProperty({ example: 'buyer@example.com' })
        @IsEmail()
        email: string;
    
        @ApiProperty({ example: 'buyerPassword123' })
        @IsString()
        @MinLength(6)
        password: any;
    
 
    
        @ApiPropertyOptional({
            type: 'string',
            format: 'binary',
            description: 'Profil rasmi (optional, file sifatida yuboriladi)',
          })
          @IsOptional()
          profileImg?: Express.Multer.File;
        

        
    }
    
    export class UpdateUserDto {
        @ApiProperty({ example: 'b3b1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e' })
        @IsUUID()
        @IsNotEmpty()
        userId: string;
      
        @ApiPropertyOptional({ example: 'Ali' })
        @IsOptional()
        @IsString()
        firstName?: string;
      
        @ApiPropertyOptional({ example: 'Valiyev' })
        @IsOptional()
        @IsString()
        lastName?: string;
      
        @ApiPropertyOptional({ enum: UserType, example: UserType.SELL })
        @IsOptional()
        @IsEnum(UserType)
        role?: UserType;
      
        @ApiPropertyOptional({ example: 'user@example.com' })
        @IsOptional()
        @IsEmail()
        email?: string;
      
        @ApiPropertyOptional({
          type: 'string',
          format: 'binary',
          description: 'Profil rasmi (file sifatida upload qilinadi)',
        })
        @IsOptional()
        profileImg?: any;    
        
        @ApiPropertyOptional({ example: 'reeeeeeeer' })
        @IsOptional()
        @IsString()
        password?: string;
    
    }
    

    export class UpdateSellerPortfolioDto {
        @ApiProperty({ example: 'b3b1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e' })
        @IsUUID()
        @IsNotEmpty()
        userId: string;
    
        @ApiPropertyOptional({ example: 'seller@example.com' })
        @IsOptional()
        @IsEmail()
        email?: string;
    
        @ApiPropertyOptional({ example: 'https://example.com/seller-portfolio.png' })
        @IsOptional()
        @IsString()
        profileImg?: string;
    }
    
    
    
