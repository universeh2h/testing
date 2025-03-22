type Pembayaran = {
    id: number;
    orderId: string;
    harga: string;
    noPembayaran: string | null; 
    noPembeli: number;
    status: string;
    metode: string;
    reference: string | null; 
    createdAt: string | null; 
    updatedAt: string | null;
  };
  
  type Transaksi = {
    id: number;
    orderId: string;
    username: string | null
    userId: string | null
    zone: string | null
    nickname: string | null
    emailVilog: string | null;
    passwordVilog: string | null;
    loginviaVilog: string | null;
    layanan: string;
    harga: number;
    profit: number;
    providerOrderId: string | null
    status: string;
    log: string | null;
    sn: string | null
    tipeTransaksi: string;
    isDigi: boolean;
    refId: string | null
    successReportSended: boolean;
    createdAt: string | null
    updatedAt: string | null
    pembayaran: Pembayaran | null; 
};
  