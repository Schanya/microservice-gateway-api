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
    const createdMeetup = await this._sendMessageFromClient<FrontendMeetup>(
      'MEETUP_CREATE',
      { createMeetupDto, organizer },
    );

    return createdMeetup;
  }

  async readById(id: string): Promise<FrontendMeetup> {
    const meetup: FrontendMeetup = await this._sendMessageFromClient(
      'MEETUP_GET_BY_ID',
      { id },
    );

    return meetup;
  }

  async readAll(
    options: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<FrontendMeetup>> {
    const meetups = await this._sendMessageFromClient<
      ReadAllResult<FrontendMeetup>
    >('MEETUP_GET_ALL', { options });

    return meetups;
  }

  async esSearch(searchText: string): Promise<MeetupSearchResult> {
    const searchResult = await this._sendMessageFromClient<MeetupSearchResult>(
      'MEETUP_ES',
      { searchText },
    );

    return searchResult;
  }

  async update(
    id: number,
    updateMeetupDto: UpdateMeetupDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await this._sendMessageFromClient<FrontendMeetup>(
      'MEETUP_UPDATE',
      { id, updateMeetupDto },
    );

    return updatedMeetup;
  }

  async delete(id: number): Promise<void> {
    await this._sendMessageFromClient('MEETUP_DELETE', { id });
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
    const meetup = await this._sendMessageFromClient<FrontendMeetup>(
      'MEETUP_JOIN',
      { meetupId, member },
    );

    return meetup;
  }

  async leaveFromMeetup(
    meetupId: number,
    member: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this._sendMessageFromClient<FrontendMeetup>(
      'MEETUP_LEAVE',
      { meetupId, member },
    );

    return meetup;
  }

  private async _sendMessageFromClient<T>(
    metadata: string,
    data: any,
  ): Promise<T> {
    const res = await sendMessage<T>({ client: this.client, metadata, data });

    return res;
  }
}
