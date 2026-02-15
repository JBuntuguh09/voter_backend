import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Images } from "./entities/image.entity";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImagesDto } from "./dto/create-image.dto";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepo: Repository<Images>,
     private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(file: Express.Multer.File, description: string|undefined, user: User): Promise<Images>{
        const cloudinaryReponse = await this.cloudinaryService.uploadFile(file);

        const newlyCreatedFile = this.imagesRepo.create({
            url: cloudinaryReponse?.secure_url,
            publicId: cloudinaryReponse?.public_id,
            base64: "",
        });
        return this.imagesRepo.save(newlyCreatedFile);
    }

  async create(dto: CreateImageDto): Promise<Images> {
    const image = this.imagesRepo.create(dto);
    return await this.imagesRepo.save(image);
  }

  async findAll(): Promise<Images[]> {
    return await this.imagesRepo.find({
      order: { id: "DESC" },
      relations: ["person"],
    });
  }

  async findOne(id: number): Promise<Images> {
    const image = await this.imagesRepo.findOne({
      where: { id },
      relations: ["person"],
    });
    if (!image) throw new NotFoundException(`Image with ID ${id} not found`);
    return image;
  }

  async update(id: number, dto: UpdateImagesDto): Promise<Images> {
    const image = await this.findOne(id);
    Object.assign(image, dto);
    return this.imagesRepo.save(image);
  }

  async remove(id: number): Promise<{ message: string }> {
    const image = await this.findOne(id);
    await this.imagesRepo.remove(image);
    return { message: `Image with ID ${id} deleted successfully` };
  }
}
