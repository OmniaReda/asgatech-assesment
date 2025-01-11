import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product';
import { Customer } from '../../models/customer';
import { Order } from '../../models/order';

interface OrderItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.scss'
})
export class NewOrderComponent implements OnInit {
  products: Product[] = [];
  customers: Customer[] = [];
  selectedItems: OrderItem[] = [];
  selectedCustomerId: string = '';
  paymentType: 'Cash' | 'Online' = 'Cash';
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    const storageVal = localStorage.getItem('selectedItems')
    this.selectedItems = storageVal ? JSON.parse(storageVal) : []
  }

  loadData() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(p => p.AvailablePieces > 0);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        this.error = 'Failed to load customers';
      }
    });
  }
  
  existingItem(product:Product) {
    return this.selectedItems.find(
    item => item.product.ProductId === product.ProductId
  );
  }

  addToOrder(product: Product) {
    const existingItem = this.selectedItems.find(
      item => item.product.ProductId === product.ProductId
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.selectedItems.push({ product, quantity: 1 });
    }
  }

  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
  }

  updateQuantity(item: OrderItem, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= item.product.AvailablePieces) {
      item.quantity = newQuantity;
    }
  }

  calculateTotal(): number {
    return this.selectedItems.reduce(
      (sum, item) => sum + (item.product.ProductPrice * item.quantity),
      0
    );
  }

  submitOrder() {
    if (!this.selectedCustomerId || this.selectedItems.length === 0) {
      this.error = 'Please select a customer and at least one product';
      return;
    }
  
    const newOrder: Order = {
      OrderId: Date.now(), // This would normally be generated by the backend
      OrderDate: new Date().toISOString(),
      UserId: this.selectedCustomerId,
      Products: this.selectedItems.map(item => ({
        ProductId: item.product.ProductId,
        Quantity: item.quantity
      })),
      PaymentType: this.paymentType
    };
    console.log(newOrder)
  localStorage.removeItem('selectedItems')
    this.orderService.addOrder(newOrder).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.error = 'Failed to create order';
        console.error('Error creating order:', error);
      }
    });
  }
}