import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  onRiskSelect,
}: SearchBarProps) => {
  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by symbol..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-card"
        />
        <Button
          variant="outline"
          onClick={() => onRiskSelect(null)}
          className={!selectedRisk ? "bg-primary/20" : ""}
        >
          All Risks
        </Button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((risk) => (
          <Button
            key={risk}
            variant="outline"
            onClick={() => onRiskSelect(risk)}
            className={selectedRisk === risk ? "bg-primary/20" : ""}
          >
            Risk {risk}
          </Button>
        ))}
      </div>
    </div>
  );
};