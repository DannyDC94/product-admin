import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSrv = inject(UtilsService);
  storage = inject(AngularFireStorage);

  // ==========Autenticacion==========

  // Usuario Logueado
  getAuth() {
    return getAuth();
  }

  // Acceder
  singIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registrar
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar Usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Enviar email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Cerrar sesion
  singOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSrv.routerLink('/auth');
  }

  // ==========Base de Datos==========

  // Obtener coleccion de datos
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }

  // Obtener documentos
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Setear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Actualiza documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // Eliminar documento
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //  Agregar documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // ==========Almacenamiento Firebase==========

  // Subir imagen
  async uploadImage(path: string, dataUrl: string) {
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  // Obtener ruta de la imagen con su url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // Eliminar archivos
  async deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path))
  }
}
