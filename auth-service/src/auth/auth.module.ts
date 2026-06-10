import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PrismaModule } from "../prisma/prisma.module";
import { ProfileController } from "../profile/profile.controller";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "24h" },
      }),
    }),
  ],
  controllers: [AuthController, ProfileController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
