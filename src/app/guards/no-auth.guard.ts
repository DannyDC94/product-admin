import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseSrv = inject(FirebaseService)
  utilSrv = inject(UtilsService)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
    return new Promise(resolve => {
      this.firebaseSrv.getAuth().onAuthStateChanged(auth => {
        if (!auth) {
          resolve(true);
        } else {
          this.utilSrv.routerLink('/main/home');
          resolve(false);
        }
      })
    });
  }
  
}
