import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SignalRService } from './core/signal-r.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'angular-signalr';

  userConnected: number = 0;
  listUsers: any = [];

  mensaje: string = "";

  constructor(
    private signalR: SignalRService,
    private elementRef:ElementRef) {
  }

  ngOnInit(): void {
    var username = prompt("Ingrese un nombre: ")
    this.signalR.createConnection(username);

    this.signalR.updateUsers$.subscribe(data => {
      this.userConnected = data.count;
      this.listUsers = data.list;
    });

    this.signalR.broadcastMessage$.subscribe(data => {
      var chatMensajes = this.elementRef.nativeElement.querySelector('.chatcontainer');
      chatMensajes.insertAdjacentHTML('beforeend', `<li><strong> ${data.name} </strong>: ${data.message} </li>`);
    })
  }

  enviarMensaje() {
    if(this.mensaje !== "") {
      this.signalR.sendMessage(this.mensaje);
    }
  }
}
