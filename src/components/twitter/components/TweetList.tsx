import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tweet {
  text: string;
  mentionedCoins: string[];
  isBullish: boolean;
}

interface TweetListProps {
  tweets: Tweet[];
}

export const TweetList = ({ tweets }: TweetListProps) => {
  return (
    <div className="space-y-4">
      {tweets.map((tweet, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm mb-2">{tweet.text}</p>
              <div className="flex flex-wrap gap-2">
                {tweet.mentionedCoins.map((coin: string) => (
                  <Badge key={coin} variant="outline">{coin}</Badge>
                ))}
              </div>
            </div>
            <Badge variant={tweet.isBullish ? "default" : "secondary"} className={tweet.isBullish ? "bg-green-500" : ""}>
              {tweet.isBullish ? "Bullish" : "Neutral"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};