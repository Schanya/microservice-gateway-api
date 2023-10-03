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
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtPayloadDto } from '@app/common';
import { UserParam } from '@gateway/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@gateway/common/guards';
import { JoiValidationPipe } from '@gateway/common/pipes';

import { MeetupService } from './meetup.service';

import {
  CreateMeetupDto,
  ElasticsearchMeetupDto,
  ReadAllMeetupDto,
  UpdateMeetupDto,
} from './dto';
import {
  CreateMeetupSchema,
  ElasticsearchMeetupSchema,
  ReadAllMeetupSchema,
  UpdateMeetupSchema,
} from './schemas';
import { FrontendMeetup, MeetupSearchResult } from './types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema))
    createMeetupDto: CreateMeetupDto,
    @UserParam() organizer: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await this.meetupService.create(
      createMeetupDto,
      organizer,
    );

    return createdMeetup;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.readById(id);

    return meetup;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema))
    options: ReadAllMeetupDto,
  ): Promise<FrontendMeetup[]> {
    const { pagination, sorting, ...filters } = options;

    const meetups = await this.meetupService.readAll({
      pagination,
      sorting,
      filters,
    });

    return meetups;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query(new JoiValidationPipe(ElasticsearchMeetupSchema))
    elasticsearchMeetup: ElasticsearchMeetupDto,
  ): Promise<MeetupSearchResult> {
    const { searchText } = elasticsearchMeetup;
    const searchResult = await this.meetupService.elasticsearch(searchText);

    return searchResult;
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
