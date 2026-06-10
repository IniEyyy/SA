import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@ApiTags("Profile")
@Controller("profiles")
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the authenticated user profile" })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
