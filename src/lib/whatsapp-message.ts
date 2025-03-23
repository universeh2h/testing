import axios from 'axios';
import { templatesWaMessageAdmin, WaMessage } from '@/data/template/wa-admin';
import { templatesWaCustMessage } from '@/data/template/wa-cust';

// Create a Fonnte client
const fonteClient = {
  sendWhatsAppMessage: async ({
    to,
    message,
  }: {
    to: string;
    message: string;
    type: string;
  }) => {
    const formData = new FormData();
    formData.append('target', to);
    formData.append('message', message);
    formData.append('countryCode', '62');

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.fonnte.com/send',
        headers: {
          Authorization: 'RjaXY87#+gXTBojDHVkZ',
        },
        data: formData,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Function to send message to customer
export async function sendCustomerNotification({
  orderData,
}: {
  orderData: WaMessage;
}) {
  try {
    const messageContent = templatesWaCustMessage(orderData);

    // Replace placeholders with actual data
    const formattedMessage = messageContent
      .replace('{{productName}}', orderData.productName)
      .replace('{{amount}}', orderData.amount.toLocaleString())
      .replace('{{link}}', orderData.link);

    // Send message using Fonnte API
    const response = await fonteClient.sendWhatsAppMessage({
      to: orderData.whatsapp as string,
      message: formattedMessage,
      type: 'text',
    });

    console.log('Message successfully sent to customer:', response);
    return response;
  } catch (error) {
    console.error('Failed to send message to customer:', error);
    throw error;
  }
}

// Function to send message to admin
export async function sendAdminNotification({
  orderData,
}: {
  orderData: WaMessage;
}) {
  try {
    const messageContent = templatesWaMessageAdmin(orderData);

    // Replace placeholders with actual data
    const formattedMessage = messageContent
      .replace('{{productName}}', orderData.productName)
      .replace('{{amount}}', orderData.amount.toLocaleString())
      .replace('{{link}}', orderData.link)
      .replace('{{customerName}}', orderData.customerName || 'Customer')
      .replace('{{orderId}}', orderData.orderId || '');

    const response = await fonteClient.sendWhatsAppMessage({
      to: process.env.NOMOR_ADMIN as string,
      message: formattedMessage,
      type: 'text',
    });

    console.log('Message successfully sent to admin:', response);
    return response;
  } catch (error) {
    console.error('Failed to send message to admin:', error);
    throw error;
  }
}

// Function to handle order status changes
export async function handleOrderStatusChange({
  orderData,
}: {
  orderData: WaMessage;
}) {
  try {
    // Send notification to customer
    await sendCustomerNotification({ orderData });

    // Send notification to admin
    await sendAdminNotification({ orderData });

    console.log('All notifications sent for order:', orderData.orderId);
    return true;
  } catch (error) {
    console.error('Error handling order status change:', error);
    throw error;
  }
}
