import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import { ICustomerRepository } from "../../interfaces/repositories/ICustomerRepository";
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
    const paymentStatusResult =
      await paymentGateway.getPaymentStatus(paymentId);

    if (!paymentStatusResult.externalReference) {
      console.error(`Payment ${paymentId} has no external reference.`);
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

  static async createPayment(
    orderId: string,
    paymentMethodId: string,
    orderRepository: IOrderRepository,
    paymentGateway: IPaymentGateway,
    customerRepository?: ICustomerRepository
  ) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "PENDING") {
      throw new Error("Order must be in PENDING status to create payment");
    }

    let customerEmail = "guest@example.com";

    if (order.customerId && customerRepository) {
      const customer = await customerRepository.findById(order.customerId);
      if (customer) {
        customerEmail = customer.email;
      }
    }

    const paymentData = {
      amount: order.totalAmount,
      description: `Pedido #${order.id}`,
      orderId: order.id,
      customerEmail,
      paymentMethodId,
    };

    const paymentResult = await paymentGateway.createPayment(paymentData);

    // Atualizar o pedido com o ID do pagamento do provedor
    // (Você pode adicionar um campo paymentProviderId na entidade Order se necessário)

    return {
      orderId: order.id,
      paymentProviderId: paymentResult.paymentProviderId,
      qrCode: paymentResult.qrCode,
      qrCodeBase64: paymentResult.qrCodeBase64,
    };
  }
}

export default PaymentUseCases;
