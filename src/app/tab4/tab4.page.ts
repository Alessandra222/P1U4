import { Component, OnInit } from '@angular/core';
import { Cart, Product, CartItem } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page  {
  public histories: Cart[] = [];

  constructor(private cartService: CartService) {
    this.cartService.getHistory().subscribe((cart: Cart[]) => { this.histories = cart;});
  }

  dateFormat(): string {
    return new Date().toDateString();
  }
}
