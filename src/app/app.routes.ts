import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component')
      .then(m => m.OrdersComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./pages/order-details/order-details.component')
      .then(m => m.OrderDetailsComponent)
  },
  {
    path: 'new-order',
    loadComponent: () => import('./pages/new-order/new-order.component')
      .then(m => m.NewOrderComponent)
  }
];