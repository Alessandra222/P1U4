import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Observable<Product[]>; //Simula en tiempo real el Observable
  public favoriteProducts: Observable<Product[]>;

  private productCollection: AngularFirestoreCollection<Product>;
  private favoriteCollection: AngularFirestoreCollection<Product>;
  

  constructor(private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection<Product>('products'); //Conectar a la colección de productos
    this.favoriteCollection = this.firestore.collection<Product>('favorites');
    this.products = this.productCollection.valueChanges(); // Pa que se actualice el arreglo al haber cambios
    this.favoriteProducts = this.favoriteCollection.valueChanges();
  }

  saveProduct(product: Product): Promise<string> {
    product.favorite = false;
    return this.productCollection
      .add(product)
      .then((doc) => {
        product.id = doc.id;
        this.productCollection.doc(product.id).update({ id: product.id });
        console.log('Producto añadido con id' + doc.id);
        return 'success';
      })
      .catch((error) => {
        console.log('Error al añadir productos' + error);
        return 'error';
      });
  }

  deleteProduct(product: Product): Promise<string> {
    this.productCollection.doc(product.id).delete();
    return Promise.resolve('success');
  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }

  //FAVORITES
  addToFavorites(product: Product): Promise<string> {
    if (!product.favorite) {
      product.favorite = true;
      this.productCollection.doc(product.id).update({ favorite: true });
      return Promise.resolve('Agregado correctamente');
    } else {
      this.productCollection.doc(product.id).update({ favorite: false });
      return Promise.resolve('Ya existe en favoritos');
    }
  }

  getFavoriteProducts(): Observable<Product[]> {
    return this.productCollection.valueChanges().pipe(
      map(products => products.filter(product => product.favorite === true))
    );
  }


}
