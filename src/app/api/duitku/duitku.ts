import { DUITKU_BASE_URL, DUITKU_CALLBACK_URL, DUITKU_EXPIRY_PERIOD, DUITKU_MERCHANT_CODE, DUITKU_RETURN_URL } from "@/constants";

interface CreatePayloadDuitku {
  merchantOrderId: string;
  amount: string;
  code: string;
  productDetails: string;
  username: string;
  time: number;
  returnUrl? : string
  sign: string;
}
export class Duitku {
  async Create({
    amount,
    code,
    merchantOrderId,
    productDetails,
    time,
    username,
    sign,
    returnUrl
  }: CreatePayloadDuitku) {
    const duitkuPayload = {
      merchantCode: DUITKU_MERCHANT_CODE,
      merchantOrderId: merchantOrderId,
      paymentAmount: amount,
      paymentMethod: code,
      productDetails,
      customerVaName: 'wafiuddin',
      callbackUrl: DUITKU_CALLBACK_URL,
      returnUrl: returnUrl  ?  returnUrl  : DUITKU_RETURN_URL,
      signature: sign,
      expiryPeriod: DUITKU_EXPIRY_PERIOD,
      additionalParam: '',
      merchantUserInfo: '',
      accountLink: '',
      timestamp: time,
    };

    const duitkuResponse = await fetch(
      `${DUITKU_BASE_URL}/api/merchant/v2/inquiry`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duitkuPayload),
      }
    );

    const paymentData = await duitkuResponse.json();
    console.log(paymentData)
    return paymentData;
  }
}
