"use client"

import { useState, useEffect } from "react"
import { ClockIcon, CopyIcon, ExternalLinkIcon, AlertCircleIcon } from "lucide-react"

interface PendingTransactionProps {
  id: number
  createdAt: string | null
  updatedAt: string | null
  status: string
  noPembayaran: string
  metode: string
  username: string
  depositId: string | null
  jumlah: number
}

export default function PendingTransaction({ data }: { data: PendingTransactionProps[] }) {
  const [showOnlyPending, setShowOnlyPending] = useState(true)

  // Filter transactions based on status
  const filteredData = showOnlyPending
    ? data.filter((transaction) => transaction.status.toLowerCase() === "pending")
    : data

  return (
    <main className="w-full  mx-auto p-4 bg-[#001435] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">History Transactions</h2>

        <div className="flex items-center space-x-2">
          <label htmlFor="filter-pending" className="text-sm text-blue-300">
            Pending
          </label>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
              showOnlyPending ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setShowOnlyPending(!showOnlyPending)}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                showOnlyPending ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-[#0a2555] rounded-lg p-6 text-center border border-blue-800">
          <p className="text-gray-300">{showOnlyPending ? "No pending transactions found" : "No transactions found"}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredData.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </main>
  )
}

function TransactionCard({ transaction }: { transaction: PendingTransactionProps }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)
  const [copied, setCopied] = useState(false)

  // Payment method lists
  const urlPaymentMethods = ["QRIS", "DANA", "OVO", "ShopeePay"]
  const vaPaymentMethods = [
    "BNI Virtual Account",
    "CIMB Virtual Account",
    "BRI Virtual Account",
    "PERMATA Virtual Account",
    "Mandiri Virtual Account",
  ]
  const retailPaymentMethods = ["Alfamart", "Pegadaian", "KantorPos"]

  // Determine payment method type
  const isUrlPayment = urlPaymentMethods.some((method) => transaction.metode.includes(method))
  const isVaPayment = vaPaymentMethods.some((method) => transaction.metode.includes(method))
  const isRetailPayment = retailPaymentMethods.some((method) => transaction.metode.includes(method))

  useEffect(() => {
    // Calculate expiration time (24 hours from createdAt)
    const calculateTimeLeft = () => {
      if (!transaction.createdAt) return

      const createdTime = new Date(transaction.createdAt).getTime()
      const expirationTime = createdTime + 24 * 60 * 60 * 1000 // 24 hours
      const now = new Date().getTime()
      const difference = expirationTime - now

      if (difference <= 0) {
        setIsExpired(true)
        return
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [transaction.createdAt])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transaction.noPembayaran)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#0a2555] border border-blue-800 rounded-lg p-5 shadow-lg">
      <div className="flex flex-wrap justify-between mb-3 gap-2">
        <div>
          <p className="font-semibold text-lg text-white">{transaction.metode}</p>
          <p className="text-sm text-blue-300">ID: {transaction.depositId || "N/A"}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-white">Rp {transaction.jumlah.toLocaleString()}</p>
          <span className="inline-block bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded font-medium">
            {transaction.status}
          </span>
        </div>
      </div>

      {!isExpired ? (
        <div className="bg-blue-900/50 p-3 rounded-md flex items-center mt-2 mb-4 border border-blue-700">
          <ClockIcon size={18} className="text-blue-300 mr-2" />
          <span className="text-blue-200 font-medium">
            Expires in: {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      ) : (
        <div className="bg-red-900/50 p-3 rounded-md flex items-center mt-2 mb-4 border border-red-700">
          <AlertCircleIcon size={18} className="text-red-300 mr-2" />
          <span className="text-red-200 font-medium">Expired</span>
        </div>
      )}

      <div className="border-t border-blue-800 pt-4">
        <p className="text-sm text-blue-300 mb-2 font-medium">Payment Information</p>

        {isUrlPayment && (
          <div className="mt-3">
            <a
              href={transaction.noPembayaran}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Pay Now <ExternalLinkIcon size={16} className="ml-2" />
            </a>
          </div>
        )}

        {isVaPayment && (
          <div className="mt-3 bg-blue-900/40 p-3 rounded-md flex justify-between items-center border border-blue-700">
            <span className="font-mono text-sm text-white">{transaction.noPembayaran}</span>
            <button
              onClick={copyToClipboard}
              className="bg-blue-700 hover:bg-blue-600 p-2 rounded-md transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <span className="text-green-300 text-xs px-1">Copied!</span>
              ) : (
                <CopyIcon size={16} className="text-white" />
              )}
            </button>
          </div>
        )}

        {isRetailPayment && (
          <div className="mt-3 bg-blue-900/40 p-3 rounded-md border border-blue-700">
            <p className="text-sm text-white font-mono">{transaction.noPembayaran}</p>
            <p className="text-xs text-blue-300 mt-1">Present this code at the payment counter</p>
          </div>
        )}

        {!isUrlPayment && !isVaPayment && !isRetailPayment && (
          <div className="mt-3 bg-blue-900/40 p-3 rounded-md border border-blue-700">
            <p className="text-sm text-white font-mono">{transaction.noPembayaran}</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-blue-400">
        Created: {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "Unknown"}
      </div>
    </div>
  )
}

