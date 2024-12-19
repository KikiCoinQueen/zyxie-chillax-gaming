import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortingControlsProps {
  sortBy: "volume" | "price" | "marketCap";
  onSortChange: (value: "volume" | "price" | "marketCap") => void;
}

export const SortingControls = ({ sortBy, onSortChange }: SortingControlsProps) => {
  return (
    <div className="flex justify-end mb-6">
      <Select 
        value={sortBy} 
        onValueChange={onSortChange}
      >
        <SelectTrigger className="w-[200px] glass-card">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="volume">Sort by Volume</SelectItem>
          <SelectItem value="price">Sort by Price</SelectItem>
          <SelectItem value="marketCap">Sort by Market Cap</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};