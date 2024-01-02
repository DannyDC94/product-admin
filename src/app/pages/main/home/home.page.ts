import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../../models/user.model';
import { Product} from '../../../models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy, where } from 'firebase/firestore'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilSvc = inject(UtilsService)

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 2000);
  }

  getProfits() {
    return this.products.reduce((index, product) => index + product.price, 0);
  }

  // Obtener productos
  async getProducts() {
    const path = `users/${this.user().uid}/products`;

    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc'),
      // where('soldUnits', '>', 30)
    ]

    let sub =  this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }

  // Agregar o actualizar productos
  async addUpdateProduct(product?: Product) {
    const success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if (success) this.getProducts();
  }

  async confirmDeleteProduct(product: Product) {
    this.utilSvc.presentAlert({
      header: 'Eliminar Producto',
      message: 'Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary'
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product)
          }
        }
      ]
    });
  }

  // Eliminar producto
  async deleteProduct(product: Product) {
    const path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    // const imagePath = await this.firebaseSvc.getFilePath(product.image);
    // await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc
      .deleteDocument(path)
      .then(async (res) => {

        this.products = this.products.filter(p => p.id !== product.id);

        this.utilSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((err) => {
        console.log(err);
        this.utilSvc.presentToast({
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
