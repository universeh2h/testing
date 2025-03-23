import { handleOrderStatusChange } from "@/lib/whatsapp-message";
import { NextResponse } from "next/server";

export  async function  POST(){
    try {
        
                await handleOrderStatusChange({
                  orderData: {
                    amount: 1010000,
                    link: '',
                    productName: `TESTING`,
                    status: 'PENDING',
                    customerName : "WAFIUDDIN",
                    method: 'UNIT TEST',
                    orderId: "BHWUWEGWEYUWYW2q712",
                    whatsapp:  `6282226197047`
                  }
                });
                return NextResponse.json({status : 'success'})
    } catch (error) {
        return NextResponse.json({status : 'gagal',error : error})

    }
}