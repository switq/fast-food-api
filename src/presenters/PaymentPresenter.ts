
export class PaymentPresenter {
  static toHttp(payment: any) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  static error(error: any) {
    return { error: error.message };
  }
}
