import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async submit() {

    const loading =  await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {
      this.utilsSvc.presentToast({
        message: 'Correo enviado con éxito', 
        duration: 2000, 
        color: 'primary',
        position: 'middle',
        icon: 'mail-outline'
      })
      this.utilsSvc.routerLink('/auth');
      this.form.reset();
    }).catch(err => {
      console.log(err);
      this.utilsSvc.presentToast({
        message: err.message, 
        duration: 2500, 
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    });
    console.log(this.form.value);
  }

}
