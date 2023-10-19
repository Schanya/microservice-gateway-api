import { TDocumentDefinitions } from 'pdfmake/interfaces';

export const docDefinition: TDocumentDefinitions = {
  content: [
    {
      layout: 'lightHorizontalLines',
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

        body: [
          [
            'id',
            'Title',
            'Description',
            'Date',
            'Place',
            'Geolocation',
            'Tags',
          ],
        ],
      },
    },
  ],
};
