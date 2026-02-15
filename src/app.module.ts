import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';
import { CandidatesModule } from './candidates/candidates.module';
import { OrganizationModule } from './organization/organization.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { RoleModule } from './role/role.module';
import { OtpModule } from './otp/otp.module';
import { MessageModule } from './message/message.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './common/config/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { ImagesModule } from './images/images.module';
import { VotesModule } from './votes/votes.module';
import { VotedModule } from './voted/voted.module';

@Module({
   imports: [
    ScheduleModule.forRoot(),
    // Loads environment variables based on NODE_ENV
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development',
        load: [configuration]
    }),
    ThrottlerModule.forRoot([{
    ttl:60000,
    limit:3
  }]),
  CacheModule.register({
    isGlobal:true,
    ttl:3000,
    max:100
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: configService.get<boolean>('AUTO_LOAD_ENTITIES'),
        synchronize: configService.get<boolean>('SYNCHRONIZE'),
      }), 
    }),
    AuthModule, PersonModule, CandidatesModule, OrganizationModule, ActivityLogsModule, RoleModule, OtpModule, MessageModule, EmailModule, ImagesModule, VotesModule, VotedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
