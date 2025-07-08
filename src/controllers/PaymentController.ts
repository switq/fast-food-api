import { Request, Response } from "express";
import { PaymentPresenter } from "../presenters/PaymentPresenter";
// Importe o use case de pagamento real quando implementado

export default class PaymentController {
  static async confirmPayment(req: Request, res: Response) {
    try {
      // Aqui você integraria com o use case de pagamento real
      // Por enquanto, simula confirmação
      const payment = { status: "Pagamento confirmado (mock)", pedidoId: req.params.pedidoId };
      res.json(PaymentPresenter.toHttp(payment));
    } catch (err: any) {
      res.status(400).json(PaymentPresenter.error(err));
    }
  }
}
