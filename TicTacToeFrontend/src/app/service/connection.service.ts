import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameService} from "./game.service";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import {Frame} from "stompjs";
import {Constants} from "../../model/Constants";
import {BehaviorSubject, Observable} from "rxjs";
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

  showOpenGames(): Observable<string[]> {
    return this.http.get(Constants.connectionUrl + "games") as Observable<string[]>;
  }

  async createGame() {
    let createdGame: GameData = GameData.empty;

    await this.http.post(Constants.connectionUrl + "games", null)
      .subscribe(async value => {
        createdGame = value as GameData;
        await this.gameService.setGame(createdGame);
        await this.connectAndSubscribe(createdGame.game.gameId);
        await this.navigateToGame(createdGame.game.gameId);
      });
  }

  navigateToGame(gameId: string) {
    this.router.navigate(["/game/", gameId]);
  }

  getGame(gameId: string): Observable<GameData> {
    return this.http.get(Constants.connectionUrl + "games/" + gameId) as Observable<GameData>;
  }

  async joinGame(gameId: string) {
    await this.getGame(gameId).subscribe(async value => {
        this.gameService.setGame(value as GameData);
        this.navigateToGame(gameId);
        await this.connectAndSubscribe(gameId);
      }
    );
  }

  webSocketEndPoint: string = 'http://localhost:8080/game';
  appPrefix: string = '/room';

  async connectAndSubscribe(gameId: string) {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    await _this.stompClient.connect({}, async function () {
      console.log("Initialize WebSocket Connection");
    }, this.errorCallBack);

    await _this.delay(100);

    // try connect to a game
    await _this.stompClient.subscribe(_this.appPrefix + '/' + gameId, async (msg: Frame) => {

      _this.showReceivedFromServer(msg);

      if (!_this.isConnected) {
        this._setPlayerNo(msg, _this);
        this._dontAllowConnectionIfTooManyPlayers(_this, ws);
      }
      await this._prepareGameAfterSuccessfulSubscribe(gameId, _this);

      this._handleStateUpdate(msg, _this);

      this._handleDisconnection(msg, _this, ws);
    });
  };

  showReceivedFromServer(message: Frame) {
    console.log("Message Recieved from Server :: " + message);
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
    }, 100);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _initializeConnection() {
    const _this = this;
    await _this.stompClient.connect({}, () => {
      console.log("Initialize WebSocket Connection");
    }, this._errorCallBack);
  }

  send() {
    this.stompClient.send(Constants.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
      gameId: this.gameService.getGameId,
      fieldNo: this.gameService.getFieldNoToSend,
      nominal: this.gameService.getNominalToSend
    }));

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

  protected _setPlayerNo(msg: Frame, _this: this) {
    let playerNo = msg.body;
    if (Constants.PLAYER_NUMBERS.includes(playerNo as string)) {
      this.isUserNotConnected.next(false);
      this.isConnected = this.canContinue = true;
      this.gameService.setPlayerNo(Number.parseInt(playerNo));
    }
  }

  protected _dontAllowConnectionIfTooManyPlayers(_this: this, ws: WebSocket) {
    if (!_this.canContinue) {
      _this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
      _this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
      ws.close();
    }
  }

  protected _prepareGameAfterSuccessfulSubscribe(gameId: string, _this: this) {
    if (!this.gameReceived) {
      this.getGame(gameId);
      setTimeout(() => {
      }, 200);
      this.gameReceived = true;
    }
  }

  protected _handleStateUpdate(msg: Frame, _this: this) { // todo - to będzie do ogarnięcia
    // próbować przywrócić działający stan rzeczy -> chyba ten _this nie wziął się znika :/
    if (msg.body.includes('gameId')) {
      let indexWherePayloadStarts = msg.toString().indexOf("{\"game");
      this.gameService.updateGame(JSON.parse(msg.toString().slice(indexWherePayloadStarts)) as GameData)
    }
  }

  protected _handleDisconnection(msg: Frame, _this: this, ws: WebSocket) {
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

  async disconnect() {
    if (!this.gameService.getGameId) return;

    let promises = [];

    promises.push(
      this.http.put(Constants.connectionUrl + 'games/' + this.gameService.getGameId, null)
        .subscribe(_ => {
        })
    );

    promises.push(
      this.stompClient.send(this.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
        surrenders: this.gameService.playerNo.getValue()
      }))
    );

    await Promise.all(promises);
  }
}
