import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'data/users.json';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return this.getCustomers().pipe(
      map(customers => customers.find(c => c.Id === id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch customer data. Please try again later.'));
  }
}