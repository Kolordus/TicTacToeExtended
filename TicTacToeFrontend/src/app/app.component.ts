import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.showAvailableGames();
  }

  connectionUrl = 'http://localhost:8080/api/v1/';
  webSocketEndPoint: string = 'http://localhost:8080/game';
  appPrefix: string = '/room';
  gameId: string = '';

  stompClient: any;
  canContinue: boolean;
  isConnected: boolean = false;
  gameReceived: boolean = false;

  availableGames: Map<string, number>;

  game: GameData | undefined;
  playerNo: number;
  selectedNominal: number;
  selectedFieldNo: number;
  winner: number | undefined = -1;

  async createGame() {
    this.http.get(this.connectionUrl + "games/create")
      .subscribe(value => {
        this.game = value as GameData;
        this.gameId = this.game.game.gameId;
      });

    await this.connectAndSubscribe();
  }

  async showAvailableGames() {
    await this.http.get(this.connectionUrl + "games")
      .subscribe(value => {
        this.availableGames = value as Map<string, number>;
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

    // próba połączenia do gry
    await _this.stompClient.subscribe(_this.appPrefix + '/' + _this.gameId, async function (msg: String) {

      _this.showReceivedFromServer(msg);

      if (!_this.isConnected) {
        if (msg.toString().endsWith('1')) {
          _this.playerNo = 1;
          _this.isConnected = _this.canContinue = true;
        }
        if (msg.toString().endsWith('2')) {
          _this.playerNo = 2;
          _this.isConnected = _this.canContinue = true;
        }

        // too many players
        if (!_this.canContinue) {
          _this.stompClient.unsubscribe(_this.appPrefix + '/' + _this.gameId);
          _this.stompClient.disconnect(_this.appPrefix + '/' + _this.gameId);
        }
      }

      // getting game right after sub
      if(!_this.gameReceived) {
        let game = await _this.getGame();
        await _this.delay(100);
        _this.game = game;
        _this.gameReceived = true;

      }

      // getting game state after update
      if (msg.toString().includes('gameId')) {
        let number = msg.toString().indexOf("{\"game");
        _this.game = JSON.parse(msg.toString().slice(number));
        _this.winner = _this.game?.whoWon == -1 ? -1 : _this.game?.whoWon;
      }

    });

  };

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

    this.stompClient.send(this.appPrefix + '/' + this.gameId, {}, JSON.stringify({
      gameId: this.game?.game.gameId,
      fieldNo: this.selectedFieldNo,
      nominal: this.selectedNominal
    }))
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setInput(fieldNo: number) {
    if (this.game?.game.currentPlayer.no === this.playerNo)
      this.selectedFieldNo = fieldNo;
  }

  selectNominal(nominal: number) {
    if (this.game?.game.currentPlayer.no === this.playerNo && this.winner === -1)
      this.selectedNominal = nominal;
  }

  getBackgroundColor(playerNo: number): string {
    if (playerNo == 1) return 'red';
    if (playerNo == 2) return 'yellow';
    return 'white';
  }
}
