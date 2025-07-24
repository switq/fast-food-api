import { Router, Request, Response } from "express";
import { MercadoPagoGateway } from "../gateways/MercadoPagoGateway";
import { PaymentCreationData } from "../../application/gateways/IPaymentGateway";

const router = Router();
const paymentGateway = new MercadoPagoGateway();

router.post("/test/payment", async (req: Request, res: Response) => {
  try {
    const testData: PaymentCreationData = {
      amount: 1.0, // 1 real for testing
      description: "Produto de Teste",
      orderId: `test-order-${Date.now()}`,
      customerEmail: "test_user_123456@testuser.com", // Test user email
      paymentMethodId: "", // Not used for preferences
    };

    const result = await paymentGateway.createPayment(testData);

    res.send(`
      <h1>Teste de Pagamento - QR Code</h1>
      <p>Escaneie o QR code abaixo com o app do Mercado Pago (logado com sua conta de comprador de teste).</p>
      <img src="data:image/png;base64,${result.qrCodeBase64}" alt="QR Code" />
      <p>URL do Checkout: <a href="${result.qrCode}" target="_blank">${result.qrCode}</a></p>
    `);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: "Erro ao gerar QR code de teste",
      error: error.message,
    });
  }
});

router.post("/test/webhook", (req: Request, res: Response) => {
  console.log("--- Webhook Received ---");
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("------------------------");
  res.status(200).send("ok");
});

export default router;
