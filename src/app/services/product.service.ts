import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Observable<Product[]>; //Simula en tiempo real el Observable

  private productCollection: AngularFirestoreCollection<Product>;


  constructor(private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection<Product>('products'); //Conectar a la colección de productos
    this.products = this.productCollection.valueChanges(); // Pa que se actualice el arreglo al haber cambios
  }

  saveProduct(product: Product): Promise<string> {
   // this.products.push(product);
   // return of(product);
   return this.productCollection.add(product)
    .then((doc)=>{console.log("Producto añadido con id"+doc.id); return "success";})
    .catch((error)=>{
      console.log("Error al añadir productos"+error);
      return "error";
    });
  }

  getProducts(): Observable<Product[]> {
    //return of(this.products);
    return this.products;
  }
}
