"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface OrderingInterfaceProps {
  onOrder?: (imagingType: string) => void;
}

export function OrderingInterface({ onOrder }: OrderingInterfaceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Imaging</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">Ordering interface placeholder</p>
        <Button onClick={() => onOrder?.("CT")}>Place Order</Button>
      </CardContent>
    </Card>
  );
}