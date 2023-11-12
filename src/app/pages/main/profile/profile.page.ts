import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage() {
    const user = this.user();
    const path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    const imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc
      .updateDocument(path, {image: user.image})
      .then(async (res) => {
        
        this.utilsSvc.saveInLocalStorage('user', user);

        this.utilsSvc.presentToast({
          message: 'Imagen actualizada exitosamente',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((err) => {
        console.log(err);
        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
    
  }

}
