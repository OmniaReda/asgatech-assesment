import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'data/products.json';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts(); 
  }

  private loadProducts() {
    this.http.get<Product[]>(this.productsUrl).subscribe({
      next: (products) => {
        this.productsSubject.next(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  editProductQuantity(productId: number, quantity: number): Observable<any> {
    return new Observable(observer => {
      const products = this.productsSubject.value;
      const product = products.find(p => p.ProductId === productId);
      
      if (product) {
        product.AvailablePieces = quantity;
        this.productsSubject.next([...products]);
        observer.next({ success: true });
      } else {
        observer.error('Product not found');
      }
      observer.complete();
    });
  }

  updateStock(productId: number, quantity: number) {
    const products = this.productsSubject.value;
    const product = products.find(p => p.ProductId === productId);
    
    if (product) {
      product.AvailablePieces -= quantity;
      this.productsSubject.next([...products]);
    }
  }
}