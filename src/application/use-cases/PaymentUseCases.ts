import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import {
  IPaymentGateway,
  PaymentStatus,
} from "../../application/gateways/IPaymentGateway";

class PaymentUseCases {
  static async handleWebhookNotification(
    paymentId: string,
    orderRepository: IOrderRepository,
    paymentGateway: IPaymentGateway
  ) {
    const paymentStatusResult = await paymentGateway.getPaymentStatus(paymentId);

    if (!paymentStatusResult.externalReference) {
      console.error(
        `Payment ${paymentId} has no external reference.`
      );
      return;
    }

    const order = await orderRepository.findById(
      paymentStatusResult.externalReference
    );

    if (order) {
      order.setPaymentStatus(paymentStatusResult.status);

      if (paymentStatusResult.status === PaymentStatus.APPROVED) {
        order.confirmPayment();
      }

      await orderRepository.update(order);
    }
  }

  static async getPaymentStatus(
    orderId: string,
    orderRepository: IOrderRepository
  ): Promise<string | null> {
    const order = await orderRepository.findById(orderId);
    return order ? order.paymentStatus : null;
  }
}

export default PaymentUseCases;
