import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Award, CheckCircle, Clock, Star } from "lucide-react";
import { formatAmount, useCompleteRequest } from "@/hooks/contracts";

interface DeliveryRequest {
  id: number;
  user: string;
  amount: string;
  isCompleted: boolean;
}

export const DriverDashboard = () => {
  const [requests, setRequests] = useState<DeliveryRequest[]>([
    {
      id: 1,
      user: "0x742d35Cc6bF4532C",
      amount: "5.00",
      isCompleted: false,
    },
    {
      id: 2,
      user: "0x2f8B97C7B42A1234",
      amount: "2.50",
      isCompleted: false,
    },
    {
      id: 3,
      user: "0x8f3A45B9C7D2E123",
      amount: "10.00",
      isCompleted: true,
    },
  ]);

  const [driverStats, setDriverStats] = useState({
    totalDeliveries: 12,
    nftBadges: 2,
    nextBadgeIn: 3,
  });

  const { toast } = useToast();
  const {
    completeRequest,
    isPending,
    error: contractError,
  } = useCompleteRequest();

  const handleCompleteDelivery = async (requestId: number) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, isCompleted: true } : req
      )
    );

    try {
      completeRequest(formatAmount(requestId));
    } catch (error) {
      console.error("Error completing delivery:", error, contractError);
    }

    // Update stats
    const newDeliveries = driverStats.totalDeliveries + 1;
    const newNextBadgeIn = 5 - (newDeliveries % 5);
    const newBadges = Math.floor(newDeliveries / 5);

    setDriverStats({
      totalDeliveries: newDeliveries,
      nftBadges: newBadges,
      nextBadgeIn: newNextBadgeIn === 5 ? 0 : newNextBadgeIn,
    });

    // Check if new badge earned
    if (newDeliveries % 5 === 0) {
      toast({
        title: "🎉 New NFT Badge Earned!",
        description: `Congratulations! You've earned a new reputation badge for completing ${newDeliveries} deliveries.`,
      });
    } else {
      toast({
        title: "Delivery Completed!",
        description: `Payment of ${request.amount} mUSDC received successfully.`,
      });
    }
  };

  const completedRequests = requests.filter((r) => r.isCompleted);
  const pendingRequests = requests.filter((r) => !r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deliveries
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverStats.totalDeliveries}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFT Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{driverStats.nftBadges}</div>
              <div className="flex">
                {Array.from({ length: driverStats.nftBadges }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Reputation badges earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Badge In</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.nextBadgeIn}</div>
            <p className="text-xs text-muted-foreground">
              deliveries remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pending Deliveries
          </CardTitle>
          <CardDescription>
            Complete deliveries to receive payments and build your reputation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending delivery requests.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Request #{request.id}</p>
                    <p className="text-sm text-muted-foreground">
                      From: {request.user}
                    </p>
                    <p className="text-sm font-semibold">
                      Amount: {request.amount} mUSDC
                    </p>
                  </div>

                  <Button
                    onClick={() => handleCompleteDelivery(request.id)}
                    size="sm"
                    disabled={isPending}
                  >
                    {isPending ? "Completing..." : "Complete Delivery"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Request #{request.id}</p>
                    <p className="text-sm text-muted-foreground">
                      From: {request.user}
                    </p>
                    <p className="text-sm font-semibold">
                      Amount: {request.amount} mUSDC
                    </p>
                  </div>

                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
