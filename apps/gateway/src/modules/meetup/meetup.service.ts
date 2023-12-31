import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { sendMessage } from '@gateway/common/utils';
import { stringify } from 'csv-stringify';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import {
  FrontendMeetup,
  IReadAllMeetupOptions,
  MeetupSearchResult,
} from './types';

import { Buffer } from 'node:buffer';
import PdfPrinter from 'pdfmake';
import { docDefinition, fonts } from './constants';

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

  async generatePdfReport(options: IReadAllMeetupOptions): Promise<Buffer> {
    const { records } = await this.readAll(options);

    for (let i = 0; i < records.length; i++) {
      const meetup = records[i];
      const geolocation = `Latitude: ${meetup.latitude}\n Longitude: ${meetup.longitude}`;
      const tags = meetup.tags.map((obj) => obj.title).join(', ');

      docDefinition.content[0].table.body.push([
        i + 1,
        meetup.title,
        meetup.description,
        meetup.date,
        meetup.place,
        geolocation,
        tags,
      ]);
    }

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const chunks: Uint8Array[] = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
      } catch (err) {
        reject(err);
      }
    });
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
