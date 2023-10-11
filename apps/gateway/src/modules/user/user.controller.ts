import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtPayloadDto, ReadAllResult } from '@app/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Roles, UserParam } from '@gateway/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@gateway/common/guards';
import { ImageValidationPipe, JoiValidationPipe } from '@gateway/common/pipes';
import { ReadAllUserDto } from './dto';
import { ReadAllUserSchema } from './schemas';
import { FrontendUser } from './types';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('USER', 'ADMIN')
  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllUserSchema))
    readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<FrontendUser>> {
    const { pagination, sorting } = readAllUserDto;
    const users = await this.userService.readAll({
      pagination,
      sorting,
    });

    return users;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id', ParseIntPipe) id: number): Promise<FrontendUser> {
    const user = await this.userService.readByUniqueField(id);

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete(id);
  }

  @Post('avatar/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UserParam() jwtPayload: JwtPayloadDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<string> {
    return await this.userService.uploadAvatar(jwtPayload, file);
  }

  @Get('avatar/download/:id')
  //   @Header('Content-Type', 'image/jpeg')
  @HttpCode(HttpStatus.OK)
  async downloadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const image = await this.userService.downloadAvatar(id);

    return image;
  }

  @Delete('avatar/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAvatar(@UserParam() jwtPayload: JwtPayloadDto): Promise<void> {
    await this.userService.removeAvatar(jwtPayload);
  }
}
