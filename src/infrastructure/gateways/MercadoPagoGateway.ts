import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import {
  IPaymentGateway,
  PaymentCreationData,
  PaymentCreationResult,
  PaymentStatus,
} from '../../application/gateways/IPaymentGateway';
import * as qrcode from 'qrcode';

export class MercadoPagoGateway implements IPaymentGateway {
  private readonly client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });
  }

  async createPayment(
    data: PaymentCreationData,
  ): Promise<PaymentCreationResult> {
    const preference = new Preference(this.client);

    const body = {
      items: [
        {
          id: data.orderId,
          title: data.description,
          quantity: 1,
          unit_price: data.amount,
        },
      ],
      payer: {
        email: data.customerEmail,
      },
      notification_url: process.env.MERCADO_PAGO_NOTIFICATION_URL,
      external_reference: data.orderId,
    };

    const response = await preference.create({ body });

    const qrCode = await qrcode.toDataURL(response.init_point!);

    const result: PaymentCreationResult = {
      paymentProviderId: response.id!.toString(),
      qrCode: response.init_point!,
      qrCodeBase64: qrCode.split('base64,')[1],
    };

    return result;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const payment = new Payment(this.client);
    try {
      const response = await payment.get({ id: paymentId });

      if (!response.status) {
        return PaymentStatus.ERROR;
      }

      switch (response.status) {
        case 'pending':
        case 'in_process':
          return PaymentStatus.PENDING;
        case 'approved':
        case 'authorized':
          return PaymentStatus.APPROVED;
        case 'rejected':
          return PaymentStatus.REJECTED;
        case 'cancelled':
          return PaymentStatus.CANCELLED;
        default:
          return PaymentStatus.ERROR;
      }
    } catch (error) {
      console.error('Error getting payment status from Mercado Pago:', error);
      return PaymentStatus.ERROR;
    }
  }
}
