import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private connection: any;
  private proxy: any;
  private name: string;

  updateUsers$ = new Subject<any>();
  broadcastMessage$ = new Subject<any>();

  constructor(private _ngZone: NgZone) { }

  createConnection(name: string) {
    let signalRServerEndPoint = 'http://localhost:54052';
    
    this.connection = $.hubConnection(signalRServerEndPoint);
    this.proxy= this.connection.createHubProxy('chat');
    this.name = name;   

    this.proxy.on('broadcastMessage', (username, message) => {
      this._ngZone.run(() => {
        var data = {
          name: username,
          message: message
        }
        this.broadcastMessage$.next(data);
      });
    });

    this.proxy.on('updateUsers', (usercount, userlist) => {
      this._ngZone.run(() => {
        var data = {
          count: usercount,
          list: userlist
        }
        this.updateUsers$.next(data);
      });
    });

    this.connection.start().done((data: any) => {
      console.log('Conectado');
      this.sendConnect(this.name);
    }).catch((error: any) => {
        console.log('Error -> ' + error);
    });
  }

  sendConnect(name: string) {
    this.proxy.invoke('Connect', name)
      .catch((error: any) => {
        console.log(`Invoke error -> ${error}`); 
      });
  }

  sendMessage(msj: string) {
    this.proxy.invoke('Send', msj)
    .catch((error: any) => {
      console.log(`Invoke error -> ${error}`); 
    });
  }
}
