import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { Images } from './entities/image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [
        TypeOrmModule.forFeature([Images, Person, User]),
        PassportModule,
        CloudinaryModule,
    MulterModule.register({
      storage:memoryStorage(),
    }),
        //configure jwt
        JwtModule.register({})
      ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
