import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../app/models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Map<number, CartItem>>(new Map());
  cartItems$ = this.cartItems.asObservable();

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.get(product.ProductId);

    if (existingItem) {
      existingItem.quantity += quantity;
      currentItems.set(product.ProductId, existingItem);
    } else {
      currentItems.set(product.ProductId, { product, quantity });
    }

    this.cartItems.next(new Map(currentItems));
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    currentItems.delete(productId);
    this.cartItems.next(new Map(currentItems));
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.get(productId);
    if (item) {
      item.quantity = quantity;
      currentItems.set(productId, item);
      this.cartItems.next(new Map(currentItems));
    }
  }

  clearCart() {
    this.cartItems.next(new Map());
  }

  getTotalItems(): number {
    let total = 0;
    this.cartItems.value.forEach(item => {
      total += item.quantity;
    });
    return total;
  }
}