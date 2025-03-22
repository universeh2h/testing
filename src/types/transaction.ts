
export interface TransactionType {
  data: {
    ref_id: string;
    customer_no: string;
    buyer_sku_code: string;
    message: string;
    status: string;
    trx_id  : string
    rc: string;
    sn: string;
  };
}
export enum TRANSACTION_FLOW  {
    PENDING = "PENDING",
    PAID = "PAID",
    PROCESS = "PROCESS",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}