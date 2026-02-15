import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto"
import { UpdateImagesDto } from "./dto/create-image.dto";
import { Images } from "./entities/image.entity";
import { JwtAuthGuard } from "src/common/gaurds/jwt-auth.guard";
import { User } from "src/auth/entities/user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "src/common/decorators/current-user.decorators";

@ApiTags("Images")
@Controller("images")
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @Post()
  @ApiOperation({ summary: "Upload or create a new image record" })
  @ApiResponse({ status: 201, type: Images })
  create(@Body() dto: CreateImageDto) {
    return this.service.create(dto);
  }

  @Post('upload')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description: string,
    @CurrentUser() user: User
  ): Promise<Images> {
    if(!file){
        throw new NotFoundException("No file found")
    }
    // Assuming you have a way to get the authenticated user
    return this.service.uploadFile(file, description, user);
  }

  @Get()
  @ApiOperation({ summary: "List all images" })
  @ApiResponse({ status: 200, type: [Images] })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get image by ID" })
  @ApiResponse({ status: 200, type: Images })
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update image details" })
  update(@Param("id") id: string, @Body() dto: UpdateImagesDto) {
    return this.service.update(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete image record" })
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}

