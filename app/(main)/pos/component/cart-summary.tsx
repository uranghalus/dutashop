import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RiDeleteBinLine, RiSubtractLine, RiAddLine } from "@remixicon/react";
import { createTransaction } from "@/action/pos-action";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { RiCheckLine, RiExpandUpDownLine } from "@remixicon/react";
import { useCustomers } from "@/hooks/crud/use-customer";

type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
};

type Props = {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
};

export function CartSummary({ cart, onUpdateQuantity, onClearCart }: Props) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page: 1,
    pageSize: 10, // Fetch top 10 matches
    query: searchQuery,
  });

  // If selected customer is not in the current list (e.g. searching for something else),
  // we might want to fetch it or just display the ID/Name if we had it.
  // For simplicity, we assume if it is selected, we might have it, or we rely on the list.
  // Ideally we should have a `useCustomer(id)` if we need to show details of selected one persistently
  // even when search changes. But for POS, usually you search, select, and stay.
  // If search changes, the selected one might disappear from list but `selectedCustomerId` remains.
  // We can try to find it in the current list OR maybe we should store the selected customer object too.
  const [selectedCustomerObj, setSelectedCustomerObj] = useState<any>(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await createTransaction({
        items: cart,
        total,
        paymentMethod: "CASH", // Default for now
        customerId: selectedCustomerId || undefined,
      });

      if (result.success) {
        toast.success("Transaction successful!", {
          action: {
            label: "Print Receipt",
            onClick: () => window.open(`/receipt/${result.data?.id}`, "_blank"),
          },
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        // Invalidate customer transactions if we had a customer selected
        if (selectedCustomerId) {
          queryClient.invalidateQueries({ queryKey: ["customers"] });
        }

        onClearCart();
        setSelectedCustomerId(null);
        setSelectedCustomerObj(null); // Clear selected customer object
        setSearchQuery("");
      } else {
        toast.error("Transaction failed: " + result.error);
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/20 space-y-3">
        <div>
          <h2 className="font-semibold text-lg">Current Order</h2>
          <div className="text-sm text-muted-foreground">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
          </div>
        </div>

        {/* Customer Selector */}
        <div className="space-y-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCustomerObj
                  ? selectedCustomerObj.name
                  : "Select Customer (Optional)"}
                <RiExpandUpDownLine className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search customer..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {customersData?.data.map((customer: any) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.id}
                        onSelect={(currentValue) => {
                          // currentValue usually is the value prop (id) or text content.
                          // cmdk uses value as ID typically if provided.
                          if (selectedCustomerId === customer.id) {
                            setSelectedCustomerId(null);
                            setSelectedCustomerObj(null);
                          } else {
                            setSelectedCustomerId(customer.id);
                            setSelectedCustomerObj(customer);
                          }
                          setOpen(false);
                        }}
                      >
                        <RiCheckLine
                          className={cn(
                            "mr-2 size-4",
                            selectedCustomerId === customer.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.name}</span>
                          {customer.phone && (
                            <span className="text-xs text-muted-foreground">
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Cart is empty
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-2 bg-muted/10 p-2 rounded border"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm line-clamp-1">
                    {item.name}
                  </span>
                  <span className="font-bold text-sm">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    @{new Intl.NumberFormat("id-ID").format(item.price)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.productId, -1)}
                    >
                      {item.quantity === 1 ? (
                        <RiDeleteBinLine className="size-3" />
                      ) : (
                        <RiSubtractLine className="size-3" />
                      )}
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.productId, 1)}
                    >
                      <RiAddLine className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(total)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={onClearCart}
            disabled={isProcessing || cart.length === 0}
          >
            Clear
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Checkout"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
