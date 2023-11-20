import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public favorite: Product[] = [];

  constructor(public productService: ProductService) {
    this.productService.getFavoriteProducts().subscribe((products: Product[]) => {
      this.favorite = products;
    });
  }

  

}
