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
  appPrefix: string = '/room';

  openGames: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  isUserNotConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private gameService: GameService, private router: Router) {
    this.ws = new SockJS(Constants.webSocketEndPoint);
    this.stompClient = Stomp.over(this.ws);
  }

  userNotConnected() {
    this.isUserNotConnected.next(!this.isConnected && !this.canContinue);
  }

  showOpenGames(): Observable<string[]> {
    return this.openGames.asObservable();
  }

  createGame() {
    let createdGame: GameData = GameData.EMPTY;

    this.http.post(Constants.connectionUrl + "games", null)
      .subscribe(async value => {
        createdGame = value as GameData;
        this.gameService.setGame(createdGame);
        // this.historyService.addMove();
        await this.connectAndSubscribe(createdGame.game.gameId);
        this.navigateToGame(createdGame.game.gameId);
      });
  }

  navigateToGame(gameId: string) {
    this.router.navigate(["/game/", gameId]).then(_ => _);
  }

  getGame(gameId: string): Observable<GameData> {
    return this.http.get(Constants.connectionUrl + "games/" + gameId) as Observable<GameData>;
  }

  joinGameAndRedirect(gameId: string) {
    this.getGame(gameId).subscribe(async value => {
        this.gameService.setGame(value as GameData);
        this.navigateToGame(gameId);
        await this.connectAndSubscribe(gameId);
      }
    );
  }


  async connectAndSubscribe(gameId: string) {
    let ws = new SockJS(Constants.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    await _this.stompClient.connect({}, async function () {
      console.log("Initialize WebSocket Connection");
    }, this.errorCallBack);

    await _this.delay(80);

    // refreshing feature
    // this.setDataInlocalStorage(_this.ws._transport.url, gameId);

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

  // tbd
  // private setDataInlocalStorage(url: string, gameId: string) {
  //   let lastSlash = url.lastIndexOf('/');
  //   let game = url.lastIndexOf('game/')
  //
  //   let trimed = url.substring(game, lastSlash)
  //   trimed = trimed.replace('game/', '');
  //   trimed += '/' + gameId
  //
  //   localStorage.setItem(Constants.WS_LS, trimed);
  // }

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

  send() {
    this.stompClient.send(Constants.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
      gameId: this.gameService.getGameId,
      fieldNo: this.gameService.fieldNoToSend,
      nominal: this.gameService.nominalToSend
    }));

    this.gameService.resetNominalAndField();
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
      }, 100);
      this.gameReceived = true;
    }
  }

  protected _handleStateUpdate(msg: Frame, _this: this) {
    if (msg.body.includes('gameId')) {
      let indexWherePayloadStarts = msg.toString().indexOf("{\"game");
      this.gameService.updateGame(JSON.parse(msg.toString().slice(indexWherePayloadStarts)) as GameData)
    }
  }

  protected _handleDisconnection(msg: Frame, _this: this, ws: WebSocket) {
    if (msg.body.includes('surrenders')) {
      let number = msg.toString().indexOf("{\"surrenders");
      let surrendedPlayer = JSON.parse(msg.toString().slice(number));

      // todo show that opponent has left

      console.log(surrendedPlayer);
      this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
      this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
      ws.close();
    }
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
        surrenders: this.gameService.playerNo$.getValue()
      }))
    );

    await Promise.all(promises);
  }

  updateGamesList() {
    setTimeout(() => {
      this.http.get(Constants.connectionUrl + "games").subscribe(games => {
        this.openGames.next(games as string[]);
      });
    }, 100);
  }

  removeFromGamesList(gameId: string) {
    let games = this.openGames.getValue();
    games = games.filter(value => value !== gameId)
    this.openGames.next(games);
  }
}
