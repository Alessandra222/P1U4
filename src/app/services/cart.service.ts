import { Injectable } from '@angular/core';
import { Cart, Product, CartItem } from '../models/product.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  private carts: Observable<Cart[]>;
  private history: Observable<Cart[]>;

  private cartCollection: AngularFirestoreCollection<Cart>;
  private historyCollection: AngularFirestoreCollection<Cart>;



  constructor(private firestore: AngularFirestore) {
    this.cartCollection = this.firestore.collection<Cart>('carts'); 
    this.historyCollection = this.firestore.collection<Cart>('history'); //---
    this.carts = this.cartCollection.valueChanges();
    this.history = this.historyCollection.valueChanges(); //-----
    this.carts.subscribe((carts: Cart[]) => {
      if (carts && carts.length > 0) {
        this.cart.next(carts[0]); // Update the BehaviorSubject with the first cart
      }
    });
    this.history.subscribe((carts: Cart[]) => { //--------
      if (carts && carts.length > 0) {
        this.cart.next(carts[0]); // Update the BehaviorSubject with the first cart
      }
    });
    
   }

   getCart(): Observable<Cart[]>{
    return this.carts;
  }

  getHistory(): Observable<Cart[]>{
    return this.history;
  }

   addToCart(product: Product): void {
    const existingCartItem = this.cart.value.items.find((item) => item.product.name === product.name);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: 1,
      };
      this.cart.value.items.push(newItem);
    }

    this.cart.value.total = this.calculateTotal(this.cart.value);
    this.cart.value.itemCount = this.calculateItemCount(this.cart.value);

    this.cartCollection.doc('cartId').set(this.cart.value)
      .then(() => console.log('Carrito actualizado en la base de datos'))
      .catch(error => console.error('Error al actualizar el carrito en la base de datos'));

    this.cart.next(this.cart.value);
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private calculateItemCount(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
  
  public async removeItemFromCart(item: CartItem, quantityToRemove: number) {
    const index = this.cart.value.items.findIndex((cartItem) => cartItem.product.id === item.product.id);
    console.log(index);
  
    if (index !== -1) {
      if (item.quantity > quantityToRemove) {
        const a= item.quantity -= quantityToRemove;
        this.cart.value.items[index].quantity = a;
      } else {
        // Si la cantidad a eliminar es igual o mayor que la cantidad en el carrito, elimina el elemento por completo.
        this.cart.value.items.splice(index, 1);
      }
  
      // Actualiza el total y la cantidad de artículos
      this.cart.value.total = this.calculateTotal(this.cart.value);
      this.cart.value.itemCount = this.calculateItemCount(this.cart.value);
      
      this.updateCartInDatabase();
  
    }
  }
  
  private async updateCartInDatabase() {
    await this.cartCollection.doc('cartId').update({
      items: this.cart.value.items,
      total: this.cart.value.total,
      itemCount: this.cart.value.itemCount
    })
      .then(() => console.log('Carrito actualizado en la base de datos'))
      .catch(error => console.error('Error al actualizar el carrito en la base de datos'));

    this.cart.next(this.cart.value);
  }


  async addToHistory(cart: Cart): Promise<void> {
    console.log("Before historyCollection.add");
    await this.historyCollection.add(cart);
    console.log("Before clearCart");
    await this.clearCart();
    console.log("Before cartCollection.doc.delete");
    await this.cartCollection.doc('cartId').delete();
    console.log("After cartCollection.doc.delete");
}


async clearCart(): Promise<void> {
    this.cart.value.items = [];
    this.cart.value.total = 0;
    this.cart.value.itemCount = 0;
    this.updateCartInDatabase();
}

  
  

  /*
  public addToCart(product: Product): void {

    const existingCartItem = this.cart.items.find((item) => item.product.name === product.name);

    if (existingCartItem) {
      // El producto ya existe en el carrito, actualiza la cantidad
      existingCartItem.quantity += 1;
    } else {
      // El producto no existe en el carrito, agrégalo como un nuevo elemento
      const newItem: CartItem = {
        product: product,
        quantity: 1,
      };
      this.cart.items.push(newItem);
    }

    // Actualiza el total y la cantidad de artículos
    this.cart.total = this.calculateTotal(this.cart);
    this.cart.itemCount = this.calculateItemCount(this.cart);

    this.cartCollection.doc('cartId').set(this.cart)
      .then(() => console.log('Carrito actualizado en la base de datos'))
      .catch(error => console.error('Error al actualizar el carrito en la base de datos', error));

    // Emite el nuevo valor del carrito
    this.cartSubject.next(this.cart);
   
  }*/

  /* public removeItemFromCart(item: CartItem, quantityToRemove: number) {
    const index = this.cart.items.findIndex((cartItem) => cartItem === item);
    if (index !== -1) {
      if (item.quantity > quantityToRemove) {
        item.quantity -= quantityToRemove;
      } else {
        // Si la cantidad a eliminar es igual o mayor que la cantidad en el carrito, elimina el elemento por completo.
        this.cart.items.splice(index, 1);
      }
  
      // Actualiza el total y la cantidad de artículos
      this.cart.total = this.calculateTotal(this.cart);
      this.cart.itemCount = this.calculateItemCount(this.cart);
    }
  }*/
}
