import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async submit() {

    const loading =  await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.singIn(this.form.value as User).then(res => {
      this.getUserInfo(res.user.uid);
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

  async getUserInfo(uid: string) {

    const loading =  await this.utilsSvc.loading();
    await loading.present();

    const path = `users/${uid}`;

    this.firebaseSvc.getDocument(path).then((user: User) => {
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.routerLink('/main/home');
      this.form.reset();

      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`, 
        duration: 1500, 
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline'
      })

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
  }

}
