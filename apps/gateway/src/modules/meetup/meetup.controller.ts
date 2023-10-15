import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';

import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { UserParam } from '@gateway/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@gateway/common/guards';
import { JoiValidationPipe } from '@gateway/common/pipes';

import { MeetupService } from './meetup.service';
import { Response } from 'express';

import {
  CreateMeetupDto,
  EsMeetupDto,
  ReadAllMeetupDto,
  UpdateMeetupDto,
} from './dto';
import {
  CreateMeetupSchema,
  EsMeetupSchema,
  ReadAllMeetupSchema,
  UpdateMeetupSchema,
} from './schemas';
import { FrontendMeetup, MeetupSearchResult } from './types';
import * as pdf from 'html-pdf';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async esSearch(
    @Query(new JoiValidationPipe(EsMeetupSchema))
    search: EsMeetupDto,
  ): Promise<MeetupSearchResult> {
    const { searchText } = search;
    const searchResult = await this.meetupService.esSearch(searchText);

    return searchResult;
  }

  @Get('generate-csv-report')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="csv-report.csv"')
  async generateCsvReport(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema))
    options: ReadAllMeetupDto,
  ): Promise<StreamableFile> {
    const { pagination, sorting, ...filters } = options;

    const output = await this.meetupService.generateCsvReport({
      pagination,
      sorting,
      filters,
    });

    return new StreamableFile(output);
  }

  @Get('generate-pdf-report')
  async generatePdfReport(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema))
    options: ReadAllMeetupDto,
    @Res() res: Response,
  ): Promise<void> {
    const { pagination, sorting, ...filters } = options;

    await this.meetupService.generatePdfReport(
      {
        pagination,
        sorting,
        filters,
      },
      res,
    );
  }

  @Post('join/:id')
  @HttpCode(HttpStatus.CREATED)
  public async joinToMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @UserParam() member: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);

    return meetup;
  }

  @Post('leave/:id')
  @HttpCode(HttpStatus.CREATED)
  public async leaveFromMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @UserParam() member: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.leaveFromMeetup(meetupId, member);

    return meetup;
  }

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
  ): Promise<ReadAllResult<FrontendMeetup>> {
    const { pagination, sorting, ...filters } = options;

    const meetups = await this.meetupService.readAll({
      pagination,
      sorting,
      filters,
    });

    return meetups;
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
