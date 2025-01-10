import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

export interface SelectedProduct {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SelectedProductsService {
  private selectedProducts = new BehaviorSubject<SelectedProduct[]>([]);

  getSelectedProducts() {
    return this.selectedProducts.asObservable();
  }

  addProduct(product: Product, quantity: number = 1) {
    const currentProducts = this.selectedProducts.value;
    const existingProduct = currentProducts.find(p => p.product.ProductId === product.ProductId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      currentProducts.push({ product, quantity });
    }

    this.selectedProducts.next([...currentProducts]);
  }

  clearProducts() {
    this.selectedProducts.next([]);
  }

  removeProduct(productId: number) {
    const currentProducts = this.selectedProducts.value;
    const updatedProducts = currentProducts.filter(p => p.product.ProductId !== productId);
    this.selectedProducts.next(updatedProducts);
  }
}