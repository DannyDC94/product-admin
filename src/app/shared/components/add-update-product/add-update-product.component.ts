import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if(soldUnits) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price) price.setValue(parseFloat(price.value));
  }

  async createProduct() {
    const path = `users/${this.user.uid}/products`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Subir la imagen y obtener la url
    const dataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;

    this.firebaseSvc
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
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

  async updateProduct() {
    const path = `users/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Si cambio la imagen, subir la nueva y obtener la url
    if (this.form.value.image !== this.product.image) {
      const dataUrl = this.form.value.image;
      const imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
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
