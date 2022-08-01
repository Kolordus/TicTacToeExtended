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

  async connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;

    // _this.stompClient.disconnect() // TODO

    // connect łączy się do sockJS
    await _this.stompClient.connect({}, async function () {

      await _this.stompClient.subscribe(_this.appPrefix + '/' + _this.hello, function (msg: String) { // to jest próba
        _this.showReceivedFromServer(msg);
        console.log('subscribe ' + msg.toString().endsWith('true'));
        _this.canContinue = msg.toString().endsWith('true');
        console.log('canContinue? ' + _this.canContinue);
      });

      await _this.delay(100);

      console.log('halo próbujemy sprawdzić czy możemy się podpiąć ' + _this.canContinue);

      if (!_this.canContinue) {
        _this.stompClient.unsubscribe(_this.appPrefix + '/' + _this.hello);
        _this.stompClient.disconnect(_this.appPrefix + '/' + _this.hello);
      }

      // ten jest do kontynuowania
      // _this.canContinue ?
      // _this.stompClient.subscribe(_this.topicPrefix + _this.hello, function (sdkEvent: String) { // to działało
      //   _this.onMessageReceived(sdkEvent);
      // }) : console.log('ni mozna');
// todo do naprawy!!!

      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };



  showReceivedFromServer(message: String) {
    console.log("Message Recieved from Server :: " + message);
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  // send() {
  //   console.log("sending");
  //   this.canContinue ?
  //     this.stompClient.send(this.appPrefix + '/' + this.hello, {}, JSON.stringify({
  //       gameId: this.hello,
  //       fieldNo: '5',
  //       nominal: '1'
  //     }))
  //     : console.log('nie mozna');
  // }

  send() {
    console.log('canContinue in send? ' + this.canContinue);

    this.stompClient.send(this.appPrefix + '/' + this.hello, {}, JSON.stringify({
      gameId: this.game?.gameId,
      fieldNo: '5',
      nominal: '1'
    }))
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
