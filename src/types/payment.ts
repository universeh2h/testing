export interface PaymentMethod {
    id: number;
    name: string;
    images: string;
    code: string;
    keterangan: string;
    type: string;
    paymentType: string | null;
    paymentCodeTripay: string | null;
    createdAt: string;
    updatedAt: string;
    min: number | null;
    max: number | null;
  }
  
  export type PaymentDetails = {
    success: boolean;
    paymentUrl: string;
    reference: string;
    statusCode: string;
    statusMessage: string;
    merchantOrderId: string;
    transactionId: number;
    amount: number;
    data: {
      status_code: string;
      status_message: string;
      transaction_id: string;
      order_id: string;
      merchant_id: string;
      gross_amount: string;
      currency: string;
      payment_type: string;
      transaction_time: string;
      transaction_status: string;
      fraud_status: string;
      va_numbers?: [
        {
          bank: string;
          va_number: string;
        }
      ];
      expiry_time: string;
    };
  };
  
  export interface DuitkuResponse {
    merchantCode: string;
    reference: string;
    paymentUrl: string;
    vaNumber: string;
    amount: string;
    statusCode: string;
    statusMessage: string;
  }
  