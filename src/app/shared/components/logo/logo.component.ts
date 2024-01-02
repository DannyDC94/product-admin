import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {

  logoApp = 'assets/icon/logoAppRev.svg'

  constructor() { }

  ngOnInit() {}

}
