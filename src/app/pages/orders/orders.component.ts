import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { Order } from '../../models/order';
import { Customer } from '../../models/customer';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface OrderViewModel {
  OrderId: number;
  OrderDate: string;
  CustomerName: string;
  TotalPrice: number;
  PaymentType: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: OrderViewModel[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    combineLatest({
      orders: this.orderService.getOrders(),
      customers: this.customerService.getCustomers()
    }).subscribe({
      next: ({ orders, customers }) => {
        // Create an array of observables for calculating order totals
        const orderWithTotals = orders.map(order => 
          this.orderService.calculateOrderTotal(order).pipe(
            map(total => ({
              OrderId: order.OrderId,
              OrderDate: new Date(order.OrderDate).toLocaleDateString(),
              CustomerName: customers.find(c => c.Id === order.UserId)?.Name || 'Unknown Customer',
              TotalPrice: total,
              PaymentType: order.PaymentType
            }))
          )
        );
        combineLatest(orderWithTotals).subscribe({
          next: (orderViewModels) => {
            this.orders = orderViewModels;
            this.loading = false;
            console.log('hereeeeeee')
          },
          error: (error) => {
            this.error = 'Failed to calculate order totals';
            this.loading = false;
            console.error('Error calculating totals:', error);
          }
        });
      },
      error: (error) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }
}