import { useEffect, useState } from "react"

export const getStatusConfig = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          color: "bg-emerald-500",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          pulseColor: "bg-emerald-400",
        }
      case "PROCESS":
        return {
          color: "bg-amber-500",
          textColor: "text-amber-700",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          pulseColor: "bg-amber-400",
        }
      case "PENDING":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          pulseColor: "bg-blue-400",
        }
      case "SUCCESS":
        return {
          color: "bg-emerald-500",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          pulseColor: "bg-emerald-400",
        }
      case "FAILED":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          pulseColor: "bg-red-400",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          pulseColor: "bg-gray-400",
        }
    }
  }



  export  function useLogicTransaksi({
    data
  }  : {
    data : Transaksi
  }){

    const [copied, setCopied] = useState<{id: string, value: boolean}>({id: "", value: false})
    const [timeLeft, setTimeLeft] = useState<string>("")
            
          // Store Duitku's reference separately
          const urlPaymentMethods = ['DA', 'OV', 'SA', 'QR']; // DANA, OVO, ShopeePay, QRIS
          
     // Determine payment type based on payment method
  const determinePaymentType = (): "VA" | "URL" | "OTHER" => {
    if (!data.pembayaran) return "OTHER"
    
    // Common Virtual Account methods
    const vaPaymentMethods = ["VA", "VIRTUAL ACCOUNT", "BCA", "BNI", "BRI", "MANDIRI", "PERMATA", "CIMB"]
    
    // Common URL-based payment methods
    const urlPaymentMethods = ["QRIS", "OVO", "GOPAY", "DANA", "LINKAJA", "SHOPEEPAY"]
    
    // Check if the reference field contains a URL
    const hasUrl = data.pembayaran.noPembayaran && 
                  (data.pembayaran.noPembayaran.startsWith('https') || 
                   data.pembayaran.noPembayaran.includes('://'))
    
    if (hasUrl) return "URL"
    
    const uppercaseMethod = data.pembayaran.metode.toUpperCase()
    if (vaPaymentMethods.some(method => uppercaseMethod.includes(method))) return "VA"
    if (urlPaymentMethods.some(method => uppercaseMethod.includes(method))) return "URL"
    
    return "OTHER"
  }

  const paymentType = determinePaymentType()

  // Calculate payment expiration time (3 hours from creation)
  useEffect(() => {
    if (!data.pembayaran?.createdAt) return

    const calculateTimeLeft = () => {
      const createTime = new Date(data.pembayaran?.createdAt || "").getTime()
      const expireTime = createTime + (3 * 60 * 60 * 1000) // 3 hours in milliseconds
      const now = new Date().getTime()
      const difference = expireTime - now

      if (difference <= 0) {
        return "Kedaluwarsa"
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [data.pembayaran?.createdAt])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied({id, value: true})
    setTimeout(() => setCopied({id: "", value: false}), 2000)
  }

  const openPaymentUrl = () => {
    if (data.pembayaran?.reference && paymentType === "URL") {
      window.open(data.pembayaran.reference, '_blank')
    }
  }

  


  return {
    url : openPaymentUrl,
    copy : copyToClipboard,
    copied,
    timeLeft,
    paymentType

  }
  }



