import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/order';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { combineLatest, map, switchMap } from 'rxjs';
import { OrdersComponent } from '../orders/orders.component';

interface OrderProductDetails {
  product: Product;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  customer: Customer | null = null;
  orderProducts: OrderProductDetails[] = [];
  totalAmount = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      map(params => Number(params['id'])),
      switchMap(orderId => {
        return combineLatest({
          order: this.orderService.getOrder(orderId),
          products: this.productService.getProducts(),
          customers: this.customerService.getCustomers()
        });
      })
    ).subscribe({
      next: ({ order, products, customers }) => {
        if (!order) {
          this.error = 'Order not found';
          this.loading = false;
          return;
        }

        this.order = order;
        this.customer = customers.find(c => c.Id === order.UserId) || null;
        
        this.orderProducts = order.Products.map(orderProduct => {
          const product = products.find(p => p.ProductId === orderProduct.ProductId);
          if (!product) {
            throw new Error(`Product ${orderProduct.ProductId} not found`);
          }
          const subtotal = product.ProductPrice * orderProduct.Quantity;
          return {
            product,
            quantity: orderProduct.Quantity,
            subtotal
          };
        });

        this.totalAmount = this.orderProducts.reduce((sum, item) => sum + item.subtotal, 0);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
        console.error('Error loading order details:', err);
      }
    });
  }
}