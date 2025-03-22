"use client"
import { useState } from "react"
import { CreditCard, DollarSign, Download, Filter, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "./data-range-picker"
import { TransactionStatusChart } from "./transaction-status-chart"
import { RevenueChart } from "./revenue-chart"
import { trpc } from "@/utils/trpc"
import { RecentTransactions } from "./recent-transactions"

export type FILTER = "ALL" | "PAYMENT" | "DEPOSIT" | "Top Up" 

export default function DashboardAdminPage() {
  const { data } = trpc.transaction.useQuery()
  const [selectedTab, setSelectedTab] = useState("overview")
  console.log(data?.revenue)
  
  // If data is undefined, display loading state
  if (!data) {
    return (
      <main className="flex flex-col gap-6 p-6 bg-background">
        <div className="h-screen flex items-center justify-center">
          <span className="text-lg">Loading dashboard data...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Lifetime transactions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {(data.revenue.thisMonth).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {data.revenue.thisMonth > data.revenue.lastMonth ? '+' : '-'}
                  {Math.abs(data.revenue.thisMonth - data.revenue.lastMonth).toLocaleString()} from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {(data.profit.thisMonth).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {data.profit.thisMonth > data.profit.lastMonth ? '+' : '-'}
                  {Math.abs(data.profit.thisMonth - data.profit.lastMonth).toLocaleString()} from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalTransactions ? 
                    Math.round((data.statusCounts.successful / data.totalTransactions) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.statusCounts.successful} successful transactions
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts and Recent Transactions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue for current period
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart data={{
                  thisMonth: data.revenue.thisMonth,
                  lastMonth: data.revenue.lastMonth
                }} />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
                <CardDescription>
                  Distribution of transaction statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionStatusChart data={{
                  successfully: data.statusCounts.successful,
                  pending: data.statusCounts.pending,
                  failed: data.statusCounts.failed
                }} />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Most recent transaction activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions data={data.recentTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of transaction data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Analytics visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Reports</CardTitle>
              <CardDescription>
                Generate and download detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Report generation options will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}