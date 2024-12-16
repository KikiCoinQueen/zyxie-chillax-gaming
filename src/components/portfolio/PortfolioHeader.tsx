import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const PortfolioHeader = () => (
  <CardHeader>
    <CardTitle className="text-3xl font-display font-bold gradient-text">
      Crypto Portfolio
    </CardTitle>
    <CardDescription>
      Track your holdings and potential gains
    </CardDescription>
  </CardHeader>
);