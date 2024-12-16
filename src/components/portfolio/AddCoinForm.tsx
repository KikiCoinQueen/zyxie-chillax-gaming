import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddCoinFormProps {
  newCoin: {
    symbol: string;
    amount: string;
    buyPrice: string;
  };
  setNewCoin: (coin: { symbol: string; amount: string; buyPrice: string }) => void;
  onAddCoin: () => void;
}

export const AddCoinForm = ({ newCoin, setNewCoin, onAddCoin }: AddCoinFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoin.symbol || !newCoin.amount || !newCoin.buyPrice) {
      toast.error("Please fill in all fields");
      return;
    }
    onAddCoin();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
      <Input
        placeholder="Coin ID (e.g., bitcoin)"
        value={newCoin.symbol}
        onChange={e => setNewCoin({ ...newCoin, symbol: e.target.value })}
        className="w-full sm:w-auto"
      />
      <Input
        type="number"
        placeholder="Amount"
        value={newCoin.amount}
        onChange={e => setNewCoin({ ...newCoin, amount: e.target.value })}
        className="w-full sm:w-auto"
      />
      <Input
        type="number"
        placeholder="Buy price (USD)"
        value={newCoin.buyPrice}
        onChange={e => setNewCoin({ ...newCoin, buyPrice: e.target.value })}
        className="w-full sm:w-auto"
      />
      <Button type="submit" className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Add Coin
      </Button>
    </form>
  );
};