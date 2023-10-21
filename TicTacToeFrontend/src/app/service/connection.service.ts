import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GameService} from "./game.service";
import * as SockJS from "sockjs-client";
import {Frame} from "stompjs";
import {Constants} from "../../model/Constants";
import {BehaviorSubject, Observable} from "rxjs";
import {GameData} from "../../model/GameData";
import {Router} from "@angular/router";
import {Client, Message, StompSubscription} from '@stomp/stompjs';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private stompClient: Client;
  private canContinue: boolean;
  private isConnected: boolean = false;
  private gameReceived: boolean = false;
  private readonly ws: any;
  private appPrefix: string = '/room';

  #openGames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  isUserNotConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  #isOpponentConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private gameService: GameService, private router: Router) {
    this.ws = new SockJS(Constants.webSocketEndPoint);
    this.stompClient = new Client();
  }

  showOpenGames(): Observable<string[]> {
    return this.#openGames$.asObservable();
  }

  isOpponentConnected(): Observable<boolean> {
    return this.#isOpponentConnected$.asObservable();
  }

  createGame() {
    let createdGame: GameData = GameData.EMPTY;

    this.http.post(Constants.connectionUrl + "games", null)
      .subscribe(async value => {
        createdGame = value as GameData;
        this.gameService.setGame(createdGame);

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
        this.#isOpponentConnected$.next(true);
        await this.connectAndSubscribe(gameId);
      }
    );
  }

  private subscription: StompSubscription;

  connectAndSubscribe(gameId: string) {
    this.stompClient.configure({
      webSocketFactory: () => new SockJS('http://localhost:8080/game'),
      onConnect: () => {
        this.subscription = this.stompClient.subscribe(this.appPrefix + '/' + gameId, (message: Message) => {
          // Handle game state updates
          console.log(message.body);

            // this.showReceivedFromServer(message.body); // debugging purpouse

            if (!this.isConnected) {
              this._setPlayerNo(message, this);
              // this._dontAllowConnectionIfTooManyPlayers(this, ws);
            }
            this._prepareGameAfterSuccessfulSubscribe(gameId, this);

            this._handleWelcome(message, this);

            this._handleStateUpdate(message, this);

            this._handleDisconnection(message, this, this.ws);
        });
      }
    });

    this.stompClient.activate();
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

  showReceivedFromServer(message: string) {
    console.log("Message Recieved from Server :: " + message);
  }

  errorCallBack(error: String) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
    }, 100);
  }


  // informAboutJoin() { // todo
  //   this.stompClient.send(this.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
  //     welcomeMsg: 'hello from: USERNAME'
  //   }))
  // }

  send() {
    // this.stompClient.send(Constants.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
    //   gameId: this.gameService.getGameId,
    //   fieldNo: this.gameService.fieldNoToSend,
    //   nominal: this.gameService.nominalToSend
    // }));

    this.stompClient.publish({
      destination: Constants.appPrefix + '/' + this.gameService.getGameId,
      body: JSON.stringify({
          gameId: this.gameService.getGameId,
          fieldNo: this.gameService.fieldNoToSend,
          nominal: this.gameService.nominalToSend
      })
    });

    this.gameService.resetNominalAndField();
  }

  protected _setPlayerNo(msg: Message, _this: this) {
    let playerNo = msg.body;
    if (Constants.PLAYER_NUMBERS.includes(playerNo as string)) {
      this.isUserNotConnected.next(false);
      this.isConnected = this.canContinue = true;
      this.gameService.setPlayerNo(Number.parseInt(playerNo));
    }
  }

  // todo
  // protected _dontAllowConnectionIfTooManyPlayers(_this: this, ws: WebSocket) {
  //   if (!_this.canContinue) {
  //     _this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
  //     _this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
  //     ws.close();
  //   }
  // }

  protected _prepareGameAfterSuccessfulSubscribe(gameId: string, _this: this) {
    if (!this.gameReceived) {
      this.getGame(gameId);
      setTimeout(() => {
      }, 100);
      this.gameReceived = true;
    }
  }

  protected _handleWelcome(msg: Message, _this: this) {
    if (msg.body.includes('welcome')) {
      this.#isOpponentConnected$.next(true);
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
      // raczej nigdy się nie przyda ale lepiej tę wiedzę zostawić na zaś
      // let number = msg.toString().indexOf("{\"surrenders");
      // let whoSurrendered = JSON.parse(msg.toString().slice(number));

      this.#isOpponentConnected$.next(false);

      this.stompClient.unsubscribe(Constants.appPrefix + '/' + this.gameService.getGameId);
      // this.stompClient.disconnect(Constants.appPrefix + '/' + this.gameService.getGameId);
      // todo
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


    //todo
    promises.push(
      // this.stompClient.publish() -> teraz tego trzeba użyć
      this.stompClient.send(this.appPrefix + '/' + this.gameService.getGameId, {}, JSON.stringify({
        surrenders: this.gameService.currentPlayer
      }))
    );

    await Promise.all(promises);
  }

  updateGamesList() {
    setTimeout(() => {
      this.http.get(Constants.connectionUrl + "games").subscribe(games => {
        this.#openGames$.next(games as string[]);
      });
    }, 100);
  }

  removeFromGamesList(gameId: string) {
    let games = this.#openGames$.getValue();
    games = games.filter(value => value !== gameId)
    this.#openGames$.next(games);
  }
}
