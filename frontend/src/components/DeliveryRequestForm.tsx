import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Truck, DollarSign } from "lucide-react";
import {
  formatAddress,
  formatAmount,
  useCreateRequest,
} from "@/hooks/contracts";

export const DeliveryRequestForm = () => {
  const [amount, setAmount] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // const { data: hash, isPending, error : contractError, writeContract } = useWriteContract();
  const { createRequest, isPending, error:contractError } = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !driverAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        return;
      }

      // Validate driver address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(driverAddress)) {
        toast({
          title: "Invalid Address",
          description: "Please enter a valid Ethereum address",
          variant: "destructive",
        });
        return;
      }

      //   writeContract({
      //   // @ts-ignore
      //   address: CONTRACT_ADDRESSES.DELIVERY_CONTRACT,
      //   abi: DELIVERY_CONTRACT_ABI,
      //   functionName: "createRequest",
      //   args: [amount, driverAddress],
      // });
      createRequest(formatAmount(amount), formatAddress(driverAddress));
    } catch (error) {
      console.error("Error creating delivery request:", error, contractError);
      toast({
        title: "Error",
        description: "Failed to create delivery request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);

      // // Simulate transaction processing
      // setTimeout(() => {
      //   toast({
      //     title: "Request Created Successfully!",
      //     description: `Delivery request for ${amount} mUSDC created. Funds are held in escrow.`,
      //   });
      //   setAmount("");
      //   setDriverAddress("");
      //   setIsSubmitting(false);
      // }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Create Delivery Request
        </CardTitle>
        <CardDescription>
          Request a delivery and pay in stablecoins. Funds are held in escrow
          until delivery is completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (mUSDC)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">Driver Address</Label>
            <Input
              id="driver"
              placeholder="0x..."
              value={driverAddress}
              onChange={(e) => setDriverAddress(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending
              ? "Creating Request..."
              : "Create Delivery Request"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Enter delivery amount and driver wallet address</li>
            <li>2. Your mUSDC tokens are held in smart contract escrow</li>
            <li>3. Driver completes delivery and claims payment</li>
            <li>4. Driver receives reputation NFT badge every 5 deliveries</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
