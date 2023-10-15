import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { sendMessage } from '@gateway/common/utils';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import {
  FrontendMeetup,
  IReadAllMeetupOptions,
  MeetupSearchResult,
} from './types';

import * as ejs from 'ejs';
import * as pdf from 'html-pdf';

import { stringify } from 'csv-stringify';
import { Response } from 'express';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP')
    private readonly client: ClientProxy,
  ) {}

  async create(
    createMeetupDto: CreateMeetupDto,
    organizer: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_CREATE',
      data: { createMeetupDto, organizer },
    });

    return createdMeetup;
  }

  async readById(id: string): Promise<FrontendMeetup> {
    const meetup: FrontendMeetup = await sendMessage({
      client: this.client,
      metadata: 'MEETUP_GET_BY_ID',
      data: { id },
    });

    return meetup;
  }

  async readAll(
    options: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<FrontendMeetup>> {
    const meetups = await sendMessage<ReadAllResult<FrontendMeetup>>({
      client: this.client,
      metadata: 'MEETUP_GET_ALL',
      data: { options },
    });

    return meetups;
  }

  async esSearch(searchText: string): Promise<MeetupSearchResult> {
    const searchResult = await sendMessage<MeetupSearchResult>({
      client: this.client,
      metadata: 'MEETUP_ES',
      data: { searchText },
    });

    return searchResult;
  }

  async update(
    id: number,
    updateMeetupDto: UpdateMeetupDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_UPDATE',
      data: { id, updateMeetupDto },
    });

    return updatedMeetup;
  }

  async delete(id: number): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: 'MEETUP_DELETE',
      data: { id },
    });
  }

  async generateCsvReport(options: IReadAllMeetupOptions): Promise<any> {
    const meetups = await this.readAll(options);

    const output = stringify(meetups.records, { header: true, delimiter: ';' });

    return output;
  }

  async generatePdfReport(
    options: IReadAllMeetupOptions,
    res: Response,
  ): Promise<void> {
    const meetups = await this.readAll(options);

    const template = `./apps/gateway/src/modules/meetup/templates/pdf.template.ejs`;

    ejs.renderFile(
      template,
      { meetups: meetups.records },
      async function (err, html) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        pdf.create(html).toBuffer(function (err, buf) {
          if (err) {
            res.status(500).send(err);
            return;
          } else {
            res.attachment('pdf-report.pdf');
            res.setHeader('Content-Type', 'text/pdf');
            res.status(200).send(buf);
          }
        });
      },
    );
  }

  async joinToMeetup(
    meetupId: number,
    member: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_JOIN',
      data: {
        meetupId,
        member,
      },
    });

    return meetup;
  }

  async leaveFromMeetup(
    meetupId: number,
    member: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_LEAVE',
      data: { meetupId, member },
    });

    return meetup;
  }
}
