import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent  implements OnInit {

  @Input() interface: string = 'action-sheet';
  @Input() placeholder: string = 'Seleccione';

  constructor() { }

  ngOnInit() {}

}
