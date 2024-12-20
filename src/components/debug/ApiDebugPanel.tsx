import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ApiDebugPanelProps {
  apiUrl: string;
  lastResponse: any;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

export const ApiDebugPanel = ({ 
  apiUrl, 
  lastResponse, 
  isLoading, 
  error,
  lastUpdated 
}: ApiDebugPanelProps) => {
  return (
    <Card className="w-full bg-black/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          API Debug Panel
          {isLoading ? (
            <Badge variant="outline" className="bg-yellow-500/20">
              <AlertCircle className="w-4 h-4 mr-1" />
              Loading
            </Badge>
          ) : error ? (
            <Badge variant="outline" className="bg-red-500/20">
              <XCircle className="w-4 h-4 mr-1" />
              Error
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-500/20">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs font-mono">
        <div>
          <div className="text-muted-foreground mb-1">Endpoint:</div>
          <div className="break-all bg-black/30 p-2 rounded">{apiUrl}</div>
        </div>
        
        {lastUpdated && (
          <div>
            <div className="text-muted-foreground mb-1">Last Updated:</div>
            <div className="bg-black/30 p-2 rounded">
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}

        {error && (
          <div>
            <div className="text-red-400 mb-1">Error:</div>
            <div className="bg-red-500/10 text-red-200 p-2 rounded break-all">
              {error.message}
            </div>
          </div>
        )}

        <div>
          <div className="text-muted-foreground mb-1">Response Preview:</div>
          <pre className="bg-black/30 p-2 rounded overflow-auto max-h-[200px] whitespace-pre-wrap break-all">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};