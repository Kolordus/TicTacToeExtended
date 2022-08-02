import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from 'stompjs';
import {delay} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  connectionUrl = 'http://localhost:8080/api/v1/';
  title = 'TicTacToeFrontend';
  game: Game | undefined;

  print() {
    console.log('controlka ' + this.hello);
    console.log('endpoint ' + this.appPrefix + '/' + this.hello);
  }

  getFromServer() {
    this.http.get(this.connectionUrl + "create")
      .subscribe(value => {
        this.game = value as Game;
      })
  }

  webSocketEndPoint: string = 'http://localhost:8080/game';
  hello: string = '';
  appPrefix: string = '/dupa';
  stompClient: any;
  canContinue: boolean;
  isConnected: boolean = false;
  gameReceived: boolean = false;
  playerNo: number;

  selectedNominal: number;
  selectedFieldNo: number;

  async connectAndSubscribe() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    await _this.stompClient.connect({}, async function () {
      console.log("Initialize WebSocket Connection");
    }, this.errorCallBack);

    await _this.delay(100);

    // próba połączenia do gry
    await _this.stompClient.subscribe(_this.appPrefix + '/' + _this.hello, async function (msg: String) {

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

        // console.log('subscribe ' + msg.toString().endsWith('true'));
        console.log('canContinue? ' + _this.canContinue);
        console.log('current player No ' + _this.playerNo);

        if (!_this.canContinue) {
          _this.stompClient.unsubscribe(_this.appPrefix + '/' + _this.hello);
          _this.stompClient.disconnect(_this.appPrefix + '/' + _this.hello);
        }
      }

      // getting game right after sub
      if(!_this.gameReceived) {
        let game = await _this.getGame();
        await _this.delay(100);
        _this.game = game;
        _this.gameReceived = true;

      }

      // etting game state
      if (msg.toString().includes('gameId')) {
        let number = msg.toString().indexOf("{\"game");
        _this.game = JSON.parse(msg.toString().slice(number));
        console.log(_this.game);
      }

    });

  };

  async getGame() {
    let game;

    await this.http.get(this.connectionUrl + "game/" + this.hello)
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

    this.stompClient.send(this.appPrefix + '/' + this.hello, {}, JSON.stringify({
      gameId: this.game?.gameId,
      fieldNo: this.selectedFieldNo,
      nominal: this.selectedNominal
    }))
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setInput(fieldNo: number) {
    if (this.game?.currentPlayer.no === this.playerNo)
      this.selectedFieldNo = fieldNo;
  }

  selectNominal(nominal: number) {
    if (this.game?.currentPlayer.no === this.playerNo)
      this.selectedNominal = nominal;
  }

  getBackgroundColor(playerNo: number): string {
    if (playerNo == 1) return 'red';
    if (playerNo == 2) return 'yellow';
    return 'white';
  }
}
