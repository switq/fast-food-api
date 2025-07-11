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

export interface IPaymentGateway {
  createPayment(data: PaymentCreationData): Promise<PaymentCreationResult>;
  // TODO: outros métodos (consultar status, etc.)
}
