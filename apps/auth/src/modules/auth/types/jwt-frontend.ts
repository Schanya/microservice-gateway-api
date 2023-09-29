export class FrontendJwt {
  public accessToken: string;
  public refreshToken: string;

  constructor(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }
}
