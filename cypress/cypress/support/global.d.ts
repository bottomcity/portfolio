declare global {
  interface Window {
    mockedSockets: { [key: string]: any };
    _smartico: any;
    _smartico_user_id?: string | null;
    _smartico_language?: string | null;
    _smartico_allow_localhost?: boolean;
    XNaveSportsbook: any;
    sportsBook: any;
  }
}

export {};
