import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { MercadoPagoGateway } from "../../infrastructure/gateways/MercadoPagoGateway";
import PaymentUseCases from "../../application/use-cases/PaymentUseCases";

class PaymentController {
  static async handleWebhookNotification(
    paymentId: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const mercadoPagoGateway = new MercadoPagoGateway();
    await PaymentUseCases.handleWebhookNotification(
      paymentId,
      orderGateway,
      mercadoPagoGateway
    );
  }
}

export default PaymentController;
