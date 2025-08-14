import React from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Route, Target, Calendar, Eye, Heart, Clock } from 'lucide-react';

const TradingRules = () => {
  const rules = [
    {
      text: "I will measure my progress only against my past self",
      icon: TrendingUp
    },
    {
      text: "My journey is unique and so is my timeline",
      icon: Route
    },
    {
      text: "One good trade that follows my rules, is success! regardless of the dollar amount",
      icon: Target
    },
    {
      text: "Consistency beats intensity",
      icon: Calendar
    },
    {
      text: "What I focus on grows",
      icon: Eye
    },
    {
      text: "I celebrate others wins, without letting them define my worth",
      icon: Heart
    },
    {
      text: "Patience is my trading edge",
      icon: Clock
    }
  ];

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-center mb-4 text-primary">
          Non-Negotiable Trading Rules
        </h3>
        <div className="space-y-3">
          {rules.map((rule, index) => {
            const IconComponent = rule.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent size={16} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                  {rule.text}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingRules;