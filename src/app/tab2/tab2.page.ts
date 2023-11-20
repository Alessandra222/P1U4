import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart, Product, CartItem } from '../models/product.model';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public carts: Cart[] = [];

constructor(private cartService: CartService, private alertController: AlertController) {
  this.cartService.getCart().subscribe((cart: Cart[]) => { this.carts = cart;});
}

async promptRemoveItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿Cuántos ${item.product.name} deseas eliminar?`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          max: item.quantity,
          value: '1', // Valor predeterminado
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: (data) => {
            const quantityToRemove = parseInt(data.quantity, 10);
            if (quantityToRemove > 0) {
              this.cartService.removeItemFromCart(item, quantityToRemove);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  calculateButtonWidth(): string {
    const screenWidth = window.innerWidth;
    const halfWidth = (screenWidth / 2)-(screenWidth * 0.10);
    return `calc(${halfWidth}px)`;
  }

  public addToHistory(cart: Cart) {
    this.cartService.addToHistory(cart);
  }



}
