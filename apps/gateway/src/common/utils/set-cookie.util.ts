import { Response } from 'express';

export function setCookie(res: Response, data: any): void {
  res.cookie('auth-cookie', data, { httpOnly: true, sameSite: true });
}
