import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto, FindPersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';

@Controller('person')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  async findAll(@Query() query: FindPersonDto) {
    return this.personService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

    @Post('bulk-upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('assemblyId') assemblyId: number,
    @CurrentUser() user: User
  ) {
    console.log(assemblyId)
    console.log("-------------")
    return this.personService.processExcel(file, assemblyId, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
