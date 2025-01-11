// src/app/pages/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SelectedProductsService } from '../../services/selected-products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  editingProduct: Product | null = null;
  newQuantity: number = 0;
  selectedProducts: Set<number> = new Set<number>();
  selectedQuantities: Map<number, number> = new Map();

  constructor(
    private productService: ProductService,
    private selectedProductsService: SelectedProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  startEditing(product: Product) {
    this.editingProduct = product;
    this.newQuantity = product.AvailablePieces;
  }

  cancelEditing() {
    this.editingProduct = null;
  }

  saveQuantity() {
    if (!this.editingProduct) return;
    
    if (this.newQuantity >= 0) {
      this.productService.editProductQuantity(
        this.editingProduct.ProductId,
        this.newQuantity
      ).subscribe({
        next: () => {
          if (this.editingProduct) {
            this.editingProduct.AvailablePieces = this.newQuantity;
          }
          this.editingProduct = null;
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          this.error = 'Failed to update product quantity';
        }
      });
    }
  }

  toggleProductSelection(product: Product) {
    if (this.selectedProducts.has(product.ProductId)) {
      this.selectedProducts.delete(product.ProductId);
      this.selectedProductsService.removeProduct(product.ProductId);
    } else {
      this.selectedProducts.add(product.ProductId);
      this.selectedProductsService.addProduct(product);
    }
  }

  addToCart(product: Product) {
    if (product.AvailablePieces > 0) {
      this.productService.updateStock(product.ProductId, 1);
      this.selectedQuantities.set(product.ProductId,  1);

      }
  }
  incrementQuantity(product: Product) {
    const currentQty = this.selectedQuantities.get(product.ProductId) || 0;
    if (product.AvailablePieces>0) {
      this.productService.updateStock(product.ProductId, 1);
      this.selectedQuantities.set(product.ProductId, currentQty + 1);
    }
  }

  decrementQuantity(product: Product) {
    const currentQty = this.selectedQuantities.get(product.ProductId) || 0;
    if (currentQty > 0) {
      this.productService.updateStock(product.ProductId, -1);
      if (currentQty === 1) {
        this.selectedQuantities.delete(product.ProductId);
      } else {
        this.selectedQuantities.set(product.ProductId, currentQty - 1);
      }
    }
  }
  getSelectedQuantity(productId: number): number {
    return this.selectedQuantities.get(productId) || 0;
  }

  getTotalSelectedItems(): number {
    let total = 0;
    this.selectedQuantities.forEach(qty => total += qty);
    return total;
  }
  proceedToOrder() {
    if (this.getTotalSelectedItems() > 0) {
      // Convert selected quantities to order items
      const items = Array.from(this.selectedQuantities.entries())
      
        .map(([productId, quantity]) => {
          const product = this.products.find(p => p.ProductId === productId);
          return product ? { product, quantity } : null;
        })
        .filter(item => item !== null);
        localStorage.setItem('selectedItems',JSON.stringify(items))

      // Navigate to new order with selected items
      this.router.navigate(['/new-order']); 
  }
  }


  updateQuantity(delta: number) {
    if (this.editingProduct) {
      const newValue = this.newQuantity + delta;
      if (newValue >= 0) {
        this.newQuantity = newValue;
      }
    
      
    }
  }
}