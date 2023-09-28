import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateMeetupSchema, UpdateMeetupSchema } from './schemas';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { FrontendMeetup } from './types/frontend-meetup.typs';

import { MeetupService } from './meetup.service';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema))
    createMeetupDto: CreateMeetupDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await this.meetupService.create(createMeetupDto);

    return createdMeetup;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<FrontendMeetup> {
    const tag = await this.meetupService.readById(id);
    return tag;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body(new JoiValidationPipe(UpdateMeetupSchema))
    updateMeetupDto: UpdateMeetupDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);

    return updatedMeetup;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: number): Promise<void> {
    await this.meetupService.delete(id);
  }
}
