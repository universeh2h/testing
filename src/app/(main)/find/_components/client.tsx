"use client"

import { useState, useEffect } from "react"
import { HeaderFindInvoice } from "./header-find-invoice"
import { trpc } from "@/utils/trpc"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MessageSquare } from "lucide-react"
import { MostPurchases } from "./mostPembelians"
import { FormatPrice } from "@/utils/formatPrice"

// Helper functions for masking sensitive data
function maskOrderId(orderId: string) {
  if (!orderId) return "-";
  const firstThree = orderId.substring(0, 3);
  return `${firstThree}***`;
}

function maskPhoneNumber(phone: string) {
  if (!phone || phone === "-") return "-";
  return "*****";
}

export function ClientPage() {
  const [term, setTerm] = useState<string>("")
  const [debouncedTerm, setDebouncedTerm] = useState<string>("")
  
  // Debounce the search term with 300ms delay
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term)
    }, 5000)
    
    return () => clearTimeout(timerId)
  }, [term])

  // Using trpc to fetch invoice data when debounced term changes
  const { data: invoiceData, isLoading, error } = trpc.pembelian.trackingInvoice.useQuery(
    { invoice: debouncedTerm },
    { enabled: debouncedTerm.length > 0 } 
  )

  // Handle the onChange event properly
  const handleSearchChange = (newTerm: string) => {
    setTerm(newTerm)
  }



  // Fetch recent transactions
  const { data: recentTransactions, isLoading: loadingRecent } = trpc.pembelian.findMostPembelian.useQuery()
console.log(recentTransactions)
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <section className="space-y-10 p-6">
        {/* Pass the correct onChange handler */}
        <HeaderFindInvoice 
          onChange={handleSearchChange} 
          term={term}
        />
        
        {/* Display error if any */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-500">Error loading invoice: {error.message}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Loading state */}
        {isLoading && debouncedTerm && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Display invoice data */}
        {invoiceData && !isLoading && (
          <Card className="border-2 border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Information for invoice #{maskOrderId(invoiceData.orderId || "")}
              </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="min-w-[150px]">Order ID</TableHead>
      <TableHead className="min-w-[150px]">Phone Number</TableHead>
      <TableHead className="min-w-[120px]">Status</TableHead>
      <TableHead className="min-w-[180px]">Last Updated</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">{maskOrderId(invoiceData.orderId || "")}</TableCell>
      <TableCell>{maskPhoneNumber(invoiceData.noPembeli.toString() || "-")}</TableCell>
      <TableCell>
        <Badge variant={invoiceData.status === "PAID" ? "default" : "secondary"}>
          {invoiceData.status || "PENDING"}
        </Badge>
      </TableCell>
      <TableCell>
        {invoiceData.updatedAt ? new Date(invoiceData.updatedAt).toLocaleString() : "-"}
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
            </CardContent>
          </Card>
        )}
      </section>

      <Card className="mt-8 bg-card shadow-lg">
  <CardHeader className="border-b">
    <CardTitle className="text-xl text-card-foreground">Recent Transactions</CardTitle>
    <CardDescription className="text-muted-foreground">
      Latest 10 transactions across the platform
    </CardDescription>
  </CardHeader>
  <CardContent className="p-0">
    {loadingRecent ? (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ) : recentTransactions && recentTransactions.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Invoice</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTransactions.map((transaction) => (
            <TableRow key={transaction.orderId} className="hover:bg-blue-100/50 p-8">
              <TableCell className="font-medium">{maskOrderId(transaction.orderId)}</TableCell>
              <TableCell>{maskPhoneNumber(transaction.noPembeli.toString() || "-")}</TableCell>
              <TableCell>
                <Badge variant={transaction.status === "PAID" ? "default" : "secondary"}>
                  {transaction.status || "PENDING"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleString() : "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <p className="p-4 text-center text-muted-foreground">No recent transactions found</p>
    )}
  </CardContent>
</Card>
    </main>
  )
}