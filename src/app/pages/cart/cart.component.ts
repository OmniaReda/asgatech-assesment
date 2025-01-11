// src/app/pages/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  isOpen:boolean = true;
  cartItems:[{product:Product,quantity:number}]=[{product:{AvailablePieces:0,ProductId:0,ProductImg:'',ProductName:'ssss',ProductPrice:30},quantity:0}]
  constructor(
  ) {}

  ngOnInit() {
    const storageVal = localStorage.getItem('selectedItems')
    this.cartItems = storageVal ? JSON.parse(storageVal) : []
  }
  checkout(){}
  getCartItems(){
    return this.cartItems;
  }
  getTotal(){
    return 2
  }
  clearCart(){}
  removeItem(productID:number){}
}