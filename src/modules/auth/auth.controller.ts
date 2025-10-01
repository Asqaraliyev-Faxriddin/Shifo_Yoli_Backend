import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { GooglePass, LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh.token.dto";
import { Reset_Password } from "./dto/reset-password";
import { AuthGuard as AuthGuard2 } from "src/common/guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Foydalanuvchini royxatdan otkazish" })
  register(@Body() dto: RegisterDto,@Req() req) {
    return this.authService.register(dto,req);
  }

  @Post("login")
  @ApiOperation({ summary: "Foydalanuvchini tizimga kiritish" })
  login(@Body() dto: LoginDto,@Req() req) {
    return this.authService.login(dto,req);
  }

  @Post("refresh-token")
  @ApiOperation({ summary: "Yangi access token olish (refresh token orqali)" })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.RefresholdAcces(dto);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Parolni OTP orqali tiklash" })
  resetPassword(@Body() dto: Reset_Password) {
    return this.authService.reset_password(dto);
  }

  // Google OAuth redirect
    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {  
    }

    // Google callback
      @Get("google/callback")
      @UseGuards(AuthGuard("google"))
      async googleAuthRedirect(@Req() req,@Res() res) {
        const result = await this.authService.googleLogin(req.user, req);

        const redirectUrl = `https://google-github.netlify.app/google/callback?` +
          `accessToken=${result.tokens.AccessToken}&` +
          `refreshToken=${result.tokens.RefreshToken}`;
      
        return res.redirect(redirectUrl);

        
      }


    @Get("github")
    @UseGuards(AuthGuard("github"))
    async githubAuth() {  
    }
  
@Get("github/callback")
@UseGuards(AuthGuard("github"))
async googleCallback(@Req() req, @Res() res) {
  const result = await this.authService.googleLogin(req.user, req);

  const redirectUrl = `https://google-github.netlify.app/google/callback?` +
    `accessToken=${result.tokens.AccessToken}&` +
    `refreshToken=${result.tokens.RefreshToken}`;

  return res.redirect(redirectUrl);
}



  
@UseGuards(AuthGuard2)
@Post("google/password")
async googlePassword(@Body() body: GooglePass, @Req() req) {
  return  this.authService.googlePassword(body, req.user.id);


}

}

//nodiraaka
