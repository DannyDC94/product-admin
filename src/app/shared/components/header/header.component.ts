import { Component, Input, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string
  @Input() backButton!: string
  @Input() isModal!: boolean
  @Input() showMenu!: boolean
  @Input() showCloseApp!: boolean

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService)

  ngOnInit() {}

  dismissModal() {
    this.utilSvc.dismissModal();
  }

  signOut() {
    this.firebaseSvc.singOut();
  }

}
