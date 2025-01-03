import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Microscope, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { MicroCapGrid } from "./components/MicroCapGrid";
import { fetchMicroCapCoins } from "./utils/microCapFetcher";
import { MicroCapHeader } from "./components/MicroCapHeader";
import { MicroCapFooter } from "./components/MicroCapFooter";

export const MicroCapScanner = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const { data: coins, isLoading, error, refetch } = useQuery({
    queryKey: ["microCapCoins"],
    queryFn: fetchMicroCapCoins,
    refetchInterval: 60000,
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching micro cap coins:", error);
        if (error.message.includes("rate limit")) {
          toast.error("API rate limit reached", {
            description: "Please wait a moment before trying again",
            duration: 5000
          });
        } else {
          toast.error("Failed to fetch micro-cap data", {
            description: "Please try again later",
            duration: 5000,
            action: {
              label: "Retry",
              onClick: () => refetch()
            }
          });
        }
      }
    }
  });

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background" id="micro-cap-scanner">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Microscope className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              True Micro Cap Scanner
            </h2>
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <MicroCapHeader />
          
          <MicroCapGrid 
            coins={coins || []}
            selectedCoin={selectedCoin}
            onCoinSelect={setSelectedCoin}
            isLoading={isLoading}
            error={error}
          />

          <MicroCapFooter />
        </motion.div>
      </div>
    </section>
  );
};