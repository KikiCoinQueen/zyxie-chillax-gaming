import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  selectedRisk: number | null;
  onSearchChange: (value: string) => void;
  onRiskSelect: (risk: number | null) => void;
}

export const SearchBar = ({
  searchTerm,
  selectedRisk,
  onSearchChange,
  onRiskSelect
}: SearchBarProps) => {
  const riskLevels = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedRisk === null ? "default" : "outline"}
          onClick={() => onRiskSelect(null)}
          size="sm"
        >
          All
        </Button>
        {riskLevels.map((risk) => (
          <Button
            key={risk}
            variant={selectedRisk === risk ? "default" : "outline"}
            onClick={() => onRiskSelect(risk)}
            size="sm"
          >
            Risk {risk}
          </Button>
        ))}
      </div>
    </div>
  );
};