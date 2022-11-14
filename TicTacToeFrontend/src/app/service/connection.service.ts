import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameService} from "./game.service";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import {Constants} from "../../model/Constants";
import {BehaviorSubject, Observable} from "rxjs";
import {Frame} from "stompjs";
import {GameData} from "../../model/GameData";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  stompClient: any;
  canContinue: boolean;
  isConnected: boolean = false;
  gameReceived: boolean = false;
  ws: any;

  constructor(private http: HttpClient, private gameService: GameService, private router: Router) {
    this.ws = new SockJS(Constants.webSocketEndPoint);
    this.stompClient = Stomp.over(this.ws);
  }

  isUserNotConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  userNotConnected() {
    this.isUserNotConnected.next(!this.isConnected && !this.canContinue);
  }

  async showAvailableGames() {
    await this.http.get(Constants.connectionUrl + "games")
      .subscribe(value => {
        console.log(value);
        // this.gameService.setAvailableGames = value as Array<string>;
      })
  }

  showOpenGames(): Observable<string[]> {
    return this.http.get(Constants.connectionUrl + "games") as Observable<string[]>;
  }

  async createGame() {
    this.http.post(Constants.connectionUrl + "games", null)
      .subscribe(value => {
        let createdGame = value as GameData;
        this.gameService.setGame(createdGame);
        this.connectAndSubscribe(createdGame.game.gameId).then(_ => {
        });
        this.navigateToGame(createdGame.game.gameId);
      });
  }

  navigateToGame(gameId: string) {
    this.router.navigate(["/game/", gameId]);
  }

  getGame(gameId: string): Observable<GameData> {
    // await this.http.get(Constants.connectionUrl + "games/" + gameId)
    //   .subscribe(value => {
    //     this.gameService.setGame(value as GameData)
    //   });
    return this.http.get(Constants.connectionUrl + "games/" + gameId) as Observable<GameData>;
  }

  async joinGame(gameId: string) {
    await this.connectAndSubscribe(gameId).then(_ => {});
    this.getGame(gameId).subscribe(value => {
        this.gameService.setGame(value as GameData);
        this.navigateToGame(gameId);
      }
    )
  }

  async connectAndSubscribe(gameId: string) {

    await this._initializeConnection();

    await this._delay(100);

    // try connect to a game
    await this.stompClient.subscribe(Constants.appPrefix + '/' + gameId,
      async (msg: Frame) => {
        this._showReceivedFromServer(msg);

        if (!this.isConnected) {
          this._setPlayerNo(msg);
          this._dontAllowConnectionIfTooManyPlayers(this.ws);
        }

        await this._prepareGameAfterSuccessfulSubscribe(gameId);

        this._handleStateUpdate(msg);

        this._handleDisconnection(msg, this.ws);
      });
  };

  async _initializeConnection() {
    await this.stompClient.connect({}, async function () {
      // console.log("Initialize WebSocket Connection");
    }, this._errorCallBack);
  }

  send() {
    this.stompClient.send(Constants.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
      gameId: this.gameService.getGameId,
      fieldNo: this.gameService.selectedFieldNo,
      nominal: this.gameService.selectedNominal
    }))

    this.gameService.resetNominalAndField();
  }

  _showReceivedFromServer(message: Frame) {
    console.log("Message Recieved from Server :: " + message);
  }

  _errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    // setTimeout(async () => {
    //   await this.connectAndSubscribe();
    // }, 5000);
  }

  protected _setPlayerNo(msg: Frame) {
    let playerNo = msg.body;
    if (Constants.PLAYER_NUMBERS.includes(playerNo as string)) {
      this.isUserNotConnected.next(false);
      this.isConnected = this.canContinue = true;
      this.gameService.setPlayerNo(Number.parseInt(playerNo));
    }
  }

  protected _dontAllowConnectionIfTooManyPlayers(ws: WebSocket) {
    if (!this.canContinue) {
      this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
      this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
      ws.close();
    }
  }

  protected async _prepareGameAfterSuccessfulSubscribe(gameId: string) {
    if (!this.gameReceived) {
      await this.getGame(gameId);
      await this._delay(100);
      this.gameReceived = true;
    }
  }

  protected _handleStateUpdate(msg: Frame) { // todo - to będzie do ogarnięcia
    if (msg.body.includes('gameId')) {
      let indexWherePayloadStarts = msg.toString().indexOf("{\"game");
      this.gameService.updateGame(JSON.parse(msg.toString().slice(indexWherePayloadStarts)) as GameData)
    }
  }

  protected _handleDisconnection(msg: Frame, ws: WebSocket) {
    if (msg.body.includes('surrenders')) {
      let number = msg.toString().indexOf("{\"surrenders");
      let surrendedPlayer = JSON.parse(msg.toString().slice(number));

      this.gameService.setWinner = surrendedPlayer.surrenders === 1 ? 2 : 1;

      this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
      this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
      ws.close();
    }
  }

  _delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
