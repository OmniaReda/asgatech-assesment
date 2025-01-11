export interface Order {
    OrderId: number;
    OrderDate: string;
    UserId: string;
    Products: OrderProduct[];
    PaymentType: string;
}

interface OrderProduct {
    ProductId: number;
    Quantity: number;
}