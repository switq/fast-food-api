export interface PaymentCreationData {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
  paymentMethodId: string; // 'pix', 'credit_card', 'ticket', etc.
}

export interface PaymentCreationResult {
  paymentProviderId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  // outros campos conforme o método de pagamento
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

export interface PaymentStatusResult {
  status: PaymentStatus;
  externalReference?: string;
}

export interface IPaymentGateway {
  createPayment(data: PaymentCreationData): Promise<PaymentCreationResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatusResult>;
}
