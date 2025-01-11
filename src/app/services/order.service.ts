import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../models/order';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'data/orders.json';

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOrder(orderId: number): Observable<Order | undefined> {
    return this.getOrders().pipe(
      map(orders => orders.find(o => o.OrderId === orderId))
    );
  }
  addOrder(order: Order): Observable<any> {
    return new Observable(observer => {
      // Simulate API delay
      setTimeout(() => {
        observer.next({ success: true, order });
        observer.complete();
      }, 500);
    }).pipe(
      catchError(this.handleError)
    );
  }

  calculateOrderTotal(order: Order): Observable<number> {
    return this.productService.getProducts().pipe(
      map(products => {
        return order.Products.reduce((total, orderProduct) => {
          const product = products.find(p => p.ProductId === orderProduct.ProductId);
          if (product) {
            return total + (product.ProductPrice * orderProduct.Quantity);
          }
          return total;
        }, 0);
      })
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}