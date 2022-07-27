import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private http: HttpClient) {}

  connectionUrl = 'http://localhost:8080/api/v1/';
  title = 'TicTacToeFrontend';

  gameId: String = '';
  game: Game | undefined;

  print() {
    console.log('gameid ' + this.gameId);
    console.log('controlka ' + this.hello);
    console.log('topic name ' + this.topicPrefix + this.hello);
    console.log('endpoint ' + this.prefix + '/' + this.hello);
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
  topic: string = this.topicPrefix + this.hello;
  prefix: string = '/app/dupa';
  stompClient: any;

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function () {
      _this.stompClient.subscribe(_this.topicPrefix + _this.hello, function (sdkEvent: String) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  onMessageReceived(message: String) {
    console.log("Message Recieved from Server :: " + message);
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  send() {
    console.log("calling logout api via web socket");
    this.stompClient.send(this.prefix + '/' + this.hello, {}, JSON.stringify({gameId: this.hello, fieldNo: '5', nominal: '1'}));
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
