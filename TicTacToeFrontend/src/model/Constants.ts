
export class Constants {
  static host: string = 'localhost';
  // static host: string = '192.168.0.108';
  static connectionUrl: string = 'http://' + Constants.host + ':8080/api/v1/';
  static webSocketEndPoint: string = 'http://' + Constants.host + ':8080/game';
  static sse_lobby: string = 'http://' + Constants.host + ':8080/sse/lobby';
  static appPrefix: string = '/room';
  static PLAYER_NUMBERS: Array<string>  = ['1', '2'];
  static WS_LS: string = "wsUrl";
}
