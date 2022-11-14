import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private http: HttpClient) {}


  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  getSse() {
    this.http.get('http://localhost:8080/')
      .subscribe(value => {
        console.log(value);
      });
  }

  sendSse() {
    this.http
      .post("http://localhost:8080/sse/room1", 'test message')
      .subscribe(_ => _);
  }

  cos() {
    // to było w ng oninit
    // this.sse.getServerSentEvent("http://localhost:8080/sse/room1")
    //   .subscribe(value => {
    //     let event = value as MessageEvent;
    //     alert(event.data);
    //     console.log(value);
    //   });
  }
}
