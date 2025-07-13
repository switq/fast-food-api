import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import {
  IPaymentGateway,
  PaymentStatus,
} from "../../application/gateways/IPaymentGateway";
import { OrderStatus } from "../../domain/entities/Order";

class PaymentUseCases {
  static async handleWebhookNotification(
    paymentId: string,
    orderRepository: IOrderRepository,
    paymentGateway: IPaymentGateway
  ) {
    const paymentStatusResult = await paymentGateway.getPaymentStatus(paymentId);

    if (paymentStatusResult.status === PaymentStatus.APPROVED) {
      if (!paymentStatusResult.externalReference) {
        // Log an error or handle the case where the external reference is missing
        console.error(
          `Payment ${paymentId} was approved but has no external reference.`
        );
        return;
      }

      const order = await orderRepository.findById(
        paymentStatusResult.externalReference
      );

      if (order) {
        order.confirmPayment();
        await orderRepository.update(order);
      }
    }
  }
}

export default PaymentUseCases;
