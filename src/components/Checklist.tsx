import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

const Checklist = () => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showStartButton, setShowStartButton] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const checklistRef = useRef<HTMLDivElement>(null);

  const handleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowStartButton(true);
    }
  };

  const handleScroll = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowStartButton(true);
    }
  };

  const handleStartMyDay = () => {
    // Navigate to journaling page
    navigate('/journaling');
  };

  useEffect(() => {
    const element = checklistRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Also track any click interaction
  const handleClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowStartButton(true);
    }
  };

  const sections = [
    {
      title: "MARKET PREP & CHART SETUP",
      badge: "✅ 1.",
      items: [
        {
          category: "📆 News & Events Awareness",
          tasks: [
            { id: "news1", text: "Check MyFXBook or economic calendar for high-impact events (NFP, CPI, FOMC)" },
            { id: "news2", text: "Avoid placing trades during or right before red/orange events on the instrument" }
          ]
        },
        {
          category: "🧭 HTF Structure Mapping",
          tasks: [
            { id: "htf1", text: "Use the 4H chart to define the broader trend (bullish, bearish, or range)" },
            { id: "htf2", text: "Mark major S/R zones and clean S/D zones" },
            { id: "htf3", text: "Label previous week's high/low, recent strong reactions, or break/bounce levels" }
          ]
        },
        {
          category: "🔍 Execution Frame Setup (1H)",
          tasks: [
            { id: "exec1", text: "Refine S/R zones on the 1H chart (align with wicks, consolidations)" },
            { id: "exec2", text: "Draw only clear, valid trendlines (2–3+ touches)" },
            { id: "exec3", text: "Set alerts — don't stare at charts all day" }
          ]
        }
      ]
    },
    {
      title: "TRENDLINE SETUP & BREAK CONDITIONS",
      badge: "✅ 2.",
      items: [
        {
          category: "",
          tasks: [
            { id: "tl1", text: "Trendline has minimum 2 solid touches, ideally 3" },
            { id: "tl2", text: "Line spans at least 24–72 hours of valid price action" },
            { id: "tl3", text: "Breakout candle is strong-bodied (not a doji or weak bar)" },
            { id: "tl4", text: "Bonus: Break occurs near an S/R zone or compression wedge" }
          ]
        }
      ]
    },
    {
      title: "CONFIRMATION FILTERS",
      badge: "✅ 3.",
      items: [
        {
          category: "📉 RSI Confirmation (Optional)",
          tasks: [
            { id: "rsi1", text: "RSI > 60 = Bullish momentum (dark green)" },
            { id: "rsi2", text: "RSI < 40 = Bearish momentum (dark purple)" }
          ]
        },
        {
          category: "🕯️ Candle Confirmation (on 1H)",
          tasks: [
            { id: "candle1", text: "Wick rejection at S/R or TL, followed by opposite close" },
            { id: "candle2", text: "Inside bar — use breakout of previous candle range" },
            { id: "candle3", text: "Engulfing or momentum candle — big-bodied, directional, strong close" }
          ]
        }
      ]
    },
    {
      title: "ENTRY CRITERIA (1H Execution)",
      badge: "✅ 4.",
      items: [
        {
          category: "",
          tasks: [
            { id: "entry1", text: "Clear trendline setup confirmed (2–3 touches, 24–72h of structure)" },
            { id: "entry2", text: "Entry candle follows clean breakout or rejection" },
            { id: "entry3", text: "Structure supports direction (higher low or lower high visible)" },
            { id: "entry4", text: "Price near key S/R for added confluence" },
            { id: "entry5", text: "Trade offers clean RR (1:2+) and low-risk entry" }
          ]
        }
      ]
    },
    {
      title: "STOP LOSS & RISK MANAGEMENT",
      badge: "✅ 5.",
      items: [
        {
          category: "",
          tasks: [
            { id: "sl1", text: "SL placed beyond the structure (not just under/above candle wick)" },
            { id: "sl2", text: "Ensure wiggle room – avoid getting wicked out on normal volatility" },
            { id: "sl3", text: "Risk 1–2% max per trade (align with personal drawdown limits)" }
          ]
        }
      ]
    },
    {
      title: "TARGETING STRATEGY",
      badge: "✅ 6.",
      items: [
        {
          category: "",
          tasks: [
            { id: "tp1", text: "TP1: Logical next HTF S/R zone or conservative RR (1.5–2)" },
            { id: "tp2", text: "TP2: Use trailing stops on 1H swing highs/lows or candle patterns" },
            { id: "tp3", text: "Optional: Leave a small runner if trend is accelerating on 4H" }
          ]
        }
      ]
    },
    {
      title: "RISK MANAGEMENT RULES",
      badge: "✅ 7.",
      items: [
        {
          category: "",
          tasks: [
            { id: "risk1", text: "Max daily loss: 2% of account" },
            { id: "risk2", text: "Max overall drawdown: 5% of account" },
            { id: "risk3", text: "Maintain consistent profit targets" },
            { id: "risk4", text: "No overtrading → 1–2 A+ setups per day are enough" }
          ]
        }
      ]
    },
    {
      title: "POST-TRADE REVIEW",
      badge: "✅ 8.",
      items: [
        {
          category: "",
          tasks: [
            { id: "review1", text: "Screenshot saved & journaled" },
            { id: "review2", text: "Grade the trade:" },
            { id: "review2a", text: "A+ = textbook entry, structure, patience", indent: true },
            { id: "review2b", text: "A- = valid but minor risk in steep trendline", indent: true },
            { id: "review2c", text: "B = decent setup, missing 1–2 confluences", indent: true },
            { id: "review2d", text: "B-/C = emotional, rushed, or over-managed", indent: true },
            { id: "review3", text: "Reflect: Did I stick to my plan? Was I calm? Was I disciplined?" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="relative">
      <div 
        ref={checklistRef}
        className="space-y-6 animate-fade-in pb-20"
        onClick={handleClick}
      >
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="glass-effect hover-float hover-glow bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 rounded-16 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 rounded-8 shadow-menu">
                  {section.badge}
                </Badge>
                <span className="text-primary">{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.items.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-4 last:mb-0">
                  {category.category && (
                    <h4 className="font-medium text-foreground/90 mb-3">
                      {category.category}
                    </h4>
                  )}
                  <div className="space-y-2">
                    {category.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-start gap-3 ${task.indent ? 'ml-6' : ''}`}
                      >
                      <Checkbox
                        id={task.id}
                        checked={checkedItems[task.id] || false}
                        onCheckedChange={() => handleCheck(task.id)}
                        className="mt-0.5 rounded-4 shadow-toggle-active data-[state=checked]:shadow-toggle-active data-[state=unchecked]:shadow-toggle-disable"
                      />
                        <label 
                          htmlFor={task.id}
                          className={`text-sm leading-relaxed cursor-pointer ${
                            checkedItems[task.id] 
                              ? 'line-through text-muted-foreground' 
                              : 'text-foreground/90'
                          }`}
                        >
                          {task.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start My Day Button */}
      {showStartButton && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 animate-scale-in">
          <Button
            onClick={handleStartMyDay}
            size="lg"
            className="bg-gradient-primary hover:bg-gradient-accent text-primary-foreground shadow-floating hover:shadow-dialog transition-all duration-300 transform hover:scale-105 rounded-20 px-8 py-6 text-lg font-semibold group glass-effect hover-glow animate-fade-in"
          >
            Start My Day
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {/* Mobile version - bottom center */}
      {showStartButton && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in md:hidden">
          <Button
            onClick={handleStartMyDay}
            size="lg"
            className="bg-gradient-primary hover:bg-gradient-accent text-primary-foreground shadow-floating hover:shadow-dialog transition-all duration-300 transform hover:scale-105 rounded-20 px-8 py-4 text-lg font-semibold group glass-effect hover-glow animate-fade-in"
          >
            Start My Day
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Checklist;