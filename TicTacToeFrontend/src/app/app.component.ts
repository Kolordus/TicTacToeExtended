import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private http: HttpClient) {
  }

  connectionUrl = 'http://localhost:8080/api/v1/';
  title = 'TicTacToeFrontend';

  gameId: String = '';
  game: Game | undefined;

  print() {
    console.log('gameid ' + this.gameId);
    console.log('controlka ' + this.hello);
    // console.log('topic name ' + this.topicPrefix + this.hello);
    console.log('endpoint ' + this.appPrefix + '/' + this.hello);
  }

  getFromServer() {
    this.http.get(this.connectionUrl + "create")
      .subscribe(value => {
        let gameWithId = value as GameWithId;
        this.gameId = gameWithId.gameId;
        this.game = gameWithId.game;
      })
  }

  webSocketEndPoint: string = 'http://localhost:8080/game';
  hello: string = '';
  topicPrefix: string = "/topic/room/";
  appPrefix: string = '/app/dupa';
  stompClient: any;

  canContinue: boolean;

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    // _this.stompClient.disconnect() // TODO


    // czyli tak -> subskrypcja tylko na chwilę, by ogarnąc czy można w ogóle
    // jeśli tak to spoko, jeśli nei ro rezygnuje

    // connect łączy się do sockJS
    _this.stompClient.connect({}, function () {

      // ten jest do uzyskania czy można kontynować
      _this.stompClient.subscribe(_this.appPrefix + '/' + _this.hello, function (sdkEvent: String) { // to jest próba
        _this.onMessageReceived(sdkEvent);
      });

      // ten jest do kontynuowania
      _this.canContinue ?
      _this.stompClient.subscribe(_this.topicPrefix + _this.hello, function (sdkEvent: String) { // to działało
        _this.onMessageReceived(sdkEvent);
      }) : console.log('ni mozna');

      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  onMessageReceived(message: String) {
    console.log("Message Recieved from Server :: " + message);

    this.canContinue = message.toString().endsWith('1');
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  send() {
    console.log("sending");
    this.canContinue ?
      this.stompClient.send(this.appPrefix + '/' + this.hello, {}, JSON.stringify({
        gameId: this.hello,
        fieldNo: '5',
        nominal: '1'
      }))
      : console.log('nie mozna');
  }
}

class GameWithId {
  game: Game;
  gameId: String;

  constructor(game: Game, gameId: String) {
    this.game = game;
    this.gameId = gameId;
  }
}
