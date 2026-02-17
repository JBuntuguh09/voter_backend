import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/gaurds/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto, GetUsersDto, LoginDto, RegisterDto, ResendResetPasswordDTO, SendOTPDTO, UpdateUserRegisterDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/create-auth.dto'
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
``
@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService,
                private readonly authService: AuthService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  async create(@Body() dto: RegisterDto, userz: User): Promise<User> {
    return this.userService.create(dto, userz);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("/send-otp")
  @ApiOperation({summary: "Send otp"})
  async sendOtp(
    @Body() dto: SendOTPDTO,
   
  ){
      return this.userService.sendOTP(dto.phone)
  }
   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get users by assemblyId or roleId' })
  getAll(@Query() query: GetUsersDto) {
    return this.userService.getAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/reset-password")
  @ApiOperation({summary: "Reset password of user"})
  async resetPassword(
    @Body() email: ResendResetPasswordDTO,
    @CurrentUser() user: User
  ){
      return this.userService.resendResetPassword2(email, user)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRegisterDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  

}

