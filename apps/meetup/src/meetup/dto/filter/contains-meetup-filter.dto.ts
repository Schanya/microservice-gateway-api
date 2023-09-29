export class ContainsMeetupDto {
  title?: { contains: string };
  description?: { contains: string };
  date?: { contains: string };
  place?: { contains: string };
}

export class ContainsTagsInMeetupDto {
  tags?: { some: { OR: { tag: IContainsTagDto }[] } };
}

export class IContainsTagDto {
  title?: { contains: string };
}
