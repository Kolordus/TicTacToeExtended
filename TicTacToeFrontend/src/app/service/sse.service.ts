import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../../model/Constants";

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private emitter: EventSource;

  constructor(private http: HttpClient, private _zone: NgZone) { }

  subscribeToLobby(): Observable<any> {
    return this._getServerSentEvent(Constants.sse_lobby);
  }

  unsubscribeLobby(): Observable<any> {
    return this.http.delete(Constants.sse_lobby, {body: this.emitter})
  }

  _getEventSource(url: string): EventSource {
    this.emitter = new EventSource(url)
    return this.emitter;
  }

  _getServerSentEvent(url: string) {
    return new Observable(observer => {
      const eventSource = this._getEventSource(url);
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
}
