import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from 'stompjs';
import {EventService} from "./service/event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy {

  gameHistory = Array<Game>();

  constructor(private http: HttpClient, private sse: EventService) {}

  async ngOnInit() {
    await this.showAvailableGames();
    this.sse.getServerSentEvent("http://localhost:8080/sse/room1")
      .subscribe(value => {
        let event = value as MessageEvent;
        alert(event.data);
        console.log(value);
      });
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    if (this.gameId !== null) {
      let promises = [];
      promises.push(
        await this.http.put(this.connectionUrl + 'games/' + this.gameId, null)
          .subscribe(_ => {})
      )
      promises.push(
        await this.stompClient.send(this.appPrefix + '/' + this.gameId.trim(), {}, JSON.stringify({
          surrenders: this.playerNo
        }))
      )
      await Promise.all(promises);
    }
  }

  connectionUrl = 'http://localhost:8080/api/v1/';
  webSocketEndPoint: string = 'http://localhost:8080/game';
  appPrefix: string = '/room';
  gameId: string = '';

  stompClient: any;
  canContinue: boolean;
  isConnected: boolean = false;
  gameReceived: boolean = false;

  availableGames: Array<string>;

  game: GameData | undefined;
  playerNo: number;
  selectedNominal: number | undefined;
  selectedFieldNo: number | undefined;
  winner: number | undefined = -1;
  sseMsg: string;

  async createGame() {
    this.http.post(this.connectionUrl + "games", null)
      .subscribe(value => {
        this.game = value as GameData;
        this.gameId = this.game.game.gameId;
      });

    await this.connectAndSubscribe();
  }

  async showAvailableGames() {
    await this.http.get(this.connectionUrl + "games")
      .subscribe(value => {
        this.availableGames = value as Array<string>;
      })
  }

  async connectAndSubscribe() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    await _this.stompClient.connect({}, async function () {
      console.log("Initialize WebSocket Connection");
    }, this.errorCallBack);

    await _this.delay(100);

    // try connect to a game
    await _this.stompClient.subscribe(_this.appPrefix + '/' + _this.gameId.trim(), async (msg: String) => {

      _this.showReceivedFromServer(msg);

      if (!_this.isConnected) {
        this._setPlayerNo(msg, _this);
        this._dontAllowConnectionIfTooManyPlayers(_this, ws);
      }
      await this._prepareGameAfterSuccessfulSubscribe(_this);

      this._handleStateUpdate(msg, _this);

      this._handleDisconnection(msg, _this, ws);
    });
  };

  protected _setPlayerNo(msg: String, _this: this) {
    if (msg.toString().endsWith('1')) {
      _this.playerNo = 1;
      _this.isConnected = _this.canContinue = true;
    }

    if (msg.toString().endsWith('2')) {
      _this.playerNo = 2;
      _this.isConnected = _this.canContinue = true;
    }
  }

  protected _dontAllowConnectionIfTooManyPlayers(_this: this, ws: WebSocket) {
    if (!_this.canContinue) {
      _this.stompClient.unsubscribe(_this.appPrefix + '/' + _this.gameId);
      _this.stompClient.disconnect(_this.appPrefix + '/' + _this.gameId);
      ws.close();
    }
  }

  protected async _prepareGameAfterSuccessfulSubscribe(_this: this) {
    if (!_this.gameReceived) {
      let game = await _this.getGame();
      await _this.delay(100);
      _this.game = game;
      _this.gameReceived = true;
    }
  }

  protected _handleStateUpdate(msg: String, _this: this) {
    if (msg.toString().includes('gameId')) {
      let indexWherePayloadStarts = msg.toString().indexOf("{\"game");
      _this.game = JSON.parse(msg.toString().slice(indexWherePayloadStarts));

      this._saveStateInMemory(this.game);

      _this.winner = _this.game?.whoWon == -1 ? -1 : _this.game?.whoWon;
    }
  }

  _saveStateInMemory(game: GameData | undefined) {
    if (game) {
      this.gameHistory.push(game.game);
    }

    this.gameHistory = this.gameHistory.filter(e => e !== undefined);
  }

  protected _handleDisconnection(msg: String, _this: this, ws: WebSocket) {
    if (msg.toString().includes('surrenders')) {
      let number = msg.toString().indexOf("{\"surrenders");
      let surrendedPlayer = JSON.parse(msg.toString().slice(number));

      _this.winner = surrendedPlayer.surrenders === 1 ? 2 : 1;

      _this.stompClient.unsubscribe(_this.appPrefix + '/' + _this.gameId);
      _this.stompClient.disconnect(_this.appPrefix + '/' + _this.gameId);
      ws.close();
    }
  }

  async getGame() {
    let game;

    await this.http.get(this.connectionUrl + "games/" + this.gameId)
      .subscribe(value => {
        game = value as Game;
      });

    await this.delay(100);

    return game;
  }

  showReceivedFromServer(message: String) {
    console.log("Message Recieved from Server :: " + message);
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connectAndSubscribe();
    }, 5000);
  }

  send() {
    console.log('canContinue in send? ' + this.canContinue);

    this.stompClient.send(this.appPrefix + '/' + this.gameId.trim(), {}, JSON.stringify({
      gameId: this.game?.game.gameId,
      fieldNo: this.selectedFieldNo,
      nominal: this.selectedNominal
    }))

    this.selectedNominal = undefined;
    this.selectedFieldNo = undefined;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  selectFieldNo(fieldNo: number) {
    if (this.isGameFinished()) return;
    if (this.game?.game.currentPlayer.no === this.playerNo)
      this.selectedFieldNo = fieldNo;
  }

  private isGameFinished() {
    return this.winner !== -1;
  }

  getBackgroundColor(playerNo: number): string {
    if (playerNo == 1) return 'red';
    if (playerNo == 2) return 'yellow';
    return 'white';
  }

  selectNominal(nominal: number) {
    if (this.isGameFinished()) return;
    if (this.game?.game.currentPlayer.no === this.playerNo && this.winner === -1)
      this.selectedNominal = nominal;
  }

  async joinGame(gameId: string) {
    this.gameId = gameId;
    await this.connectAndSubscribe();
  }

  getSse() {
    this.http.get('http://localhost:8080/')
      .subscribe(value => {
        console.log(value);
      });
  }

  showHistory() {
    console.log(this.gameHistory);
  }

  showMoveOfIndex(i: number) {

    let game1 = this.gameHistory[i];
    console.log(JSON.stringify(game1));
  }

  sendSse() {
    console.log(this.sseMsg)
    this.http.post("http://localhost:8080/sse/room1", this.sseMsg).subscribe(_ => _);
  }
}
