import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private http: HttpClient, private _zone: NgZone) {
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  subscribeToLobby() {
    return this.getServerSentEvent("http://localhost:8080/sse/lobby");
  }

  creationOfGame(gameId: string) {
    this.http
      .post("http://localhost:8080/sse/lobby", 'create ' + gameId)
      .subscribe(_ => _);
  }

  getServerSentEvent(url: string) {
    return new Observable(observer => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        })
      }

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error)
        })
      }
    });
  }

  removalOfGame(gameId: string) {
    this.http
      .post("http://localhost:8080/sse/lobby", 'delete ' + gameId)
      .subscribe(_ => _);
  }
}
