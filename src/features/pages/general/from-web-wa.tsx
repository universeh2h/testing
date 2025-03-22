"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormConfigWebProps } from "./form-web-umum";
import { FormWa } from "./formwa"; // This is our TipTap editor component from earlier


export function FormWaMessage({ errors, formData, onChange }: FormConfigWebProps) {
  const handleTabChange = (value: string) => {
    // Update selected status in formData if needed
    onChange({
      target: {
        name: "wa_status",
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Updated function to match the formData property names
  const handleMessageChange = (status: string) => (html: string) => {
    onChange({
      target: {
        name: `wa${status}`, // Now matches your formData structure (waPending, waPaid, etc.)
        value: html
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Message</CardTitle>
        <CardDescription>Configure messages for different order statuses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="PENDING" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="PAID">Paid</TabsTrigger>
            <TabsTrigger value="PROCESS">Process</TabsTrigger>
            <TabsTrigger value="SUCCESS">Success</TabsTrigger>
          </TabsList>
          
          <TabsContent value="PENDING" className="space-y-2">
            <div className="space-y-2">
              <Label>Pending Order Message</Label>
              <FormWa 
                value={formData.waPending || ""} 
                onChange={handleMessageChange("Pending")}
                placeholder="Enter message for pending orders..." 
              />
              <p className="text-xs text-gray-500">
                Available variables: {'{order_id}'}, {'{customer_name}'}, {'{amount}'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="PAID" className="space-y-2">
            <div className="space-y-2">
              <Label>Paid Order Message</Label>
              <FormWa 
                value={formData.waPaid || ""} 
                onChange={handleMessageChange("Paid")}
                placeholder="Enter message for paid orders..." 
              />
              <p className="text-xs text-gray-500">
                Available variables: {'{order_id}'}, {'{customer_name}'}, {'{payment_method}'}, {'{amount}'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="PROCESS" className="space-y-2">
            <div className="space-y-2">
              <Label>Processing Order Message</Label>
              <FormWa 
                value={formData.waProcess || ""} 
                onChange={handleMessageChange("Process")}
                placeholder="Enter message for orders in process..." 
              />
              <p className="text-xs text-gray-500">
                Available variables: {'{order_id}'}, {'{customer_name}'}, {'{estimated_time}'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="SUCCESS" className="space-y-2">
            <div className="space-y-2">
              <Label>Completed Order Message</Label>
              <FormWa 
                value={formData.waSuccess || ""} 
                onChange={handleMessageChange("Success")}
                placeholder="Enter message for completed orders..." 
              />
              <p className="text-xs text-gray-500">
                Available variables: {'{order_id}'}, {'{customer_name}'}, {'{tracking_number}'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}