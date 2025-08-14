import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, Star, TrendingUp, TrendingDown, Clock, Target, Shield, Zap } from 'lucide-react';
import { TradeCalculationResults } from '../utils/tradeCalculations';
import { formatCurrency, formatPrice, formatTicks } from '../utils/tradeCalculations';
import { useToast } from '../hooks/use-toast';

interface RichSummaryPanelProps {
  side: 'LONG' | 'SHORT';
  contracts: number;
  instrument: string;
  sessionTags: string[];
  calculations: TradeCalculationResults;
  entry: number;
  exit?: number;
  stopLoss?: number;
  profitTarget?: number;
  startTime?: string;
  endTime?: string;
  tradeRating?: number;
}

const RichSummaryPanel: React.FC<RichSummaryPanelProps> = ({
  side,
  contracts,
  instrument,
  sessionTags,
  calculations,
  entry,
  exit,
  stopLoss,
  profitTarget,
  startTime,
  endTime,
  tradeRating = 0
}) => {
  const { toast } = useToast();

  const calculateDuration = (): string => {
    if (!startTime || !endTime) return '—';
    
    try {
      const start = new Date(`2024-01-01T${startTime}`);
      const end = new Date(`2024-01-01T${endTime}`);
      const diff = end.getTime() - start.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch {
      return '—';
    }
  };

  const generateSummaryText = (): string => {
    const status = calculations.isOpen ? 'OPEN' : 'CLOSED';
    const pnlText = calculations.isOpen ? 'Projected P&L' : 'Realized P&L';
    
    return `📓 TRADE SUMMARY
    
🎯 ${side} ${contracts} contracts ${instrument}
Status: ${status}
${sessionTags.length > 0 ? `Sessions: ${sessionTags.join(', ')}` : ''}

💰 ${pnlText}: ${formatCurrency(calculations.netPnl)}
📊 Total Ticks: ${formatTicks(calculations.totalTicks)}
💸 Gross P&L: ${formatCurrency(calculations.grossPnl)}
🏷️ Fees: ${formatCurrency(calculations.feesTotal)}

📈 Entry: ${formatPrice(entry)}
${exit ? `🏁 Exit: ${formatPrice(exit)}` : ''}
${stopLoss ? `🛡️ Stop Loss: ${formatPrice(stopLoss)}` : ''}
${profitTarget ? `🎯 Target: ${formatPrice(profitTarget)}` : ''}

${calculations.plannedRMultiple !== null && calculations.plannedRMultiple !== undefined ? `📐 Planned R: ${calculations.plannedRMultiple.toFixed(2)}` : ''}
${calculations.realizedRMultiple !== null && calculations.realizedRMultiple !== undefined ? `⭐ Realized R: ${calculations.realizedRMultiple.toFixed(2)}` : ''}
${calculations.roiPercent !== null && calculations.roiPercent !== undefined ? `📊 ROI: ${calculations.roiPercent.toFixed(2)}%` : ''}

${calculations.mfeDollar ? `📈 MFE: ${formatCurrency(calculations.mfeDollar)}` : ''}
${calculations.maeDollar ? `📉 MAE: ${formatCurrency(calculations.maeDollar)}` : ''}

⏱️ Duration: ${calculateDuration()}
⭐ Rating: ${tradeRating}/5 stars`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      toast({
        title: "Copied!",
        description: "Trade summary copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const pnlColor = calculations.netPnl > 0 ? 'text-green-600' : calculations.netPnl < 0 ? 'text-red-600' : 'text-gray-600';
  const pnlBgColor = calculations.netPnl > 0 ? 'bg-green-50' : calculations.netPnl < 0 ? 'bg-red-50' : 'bg-gray-50';

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📓</span>
            <span className="text-lg">Trade Summary</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="p-2"
          >
            <Copy size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Badge Row */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={side === 'LONG' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {side === 'LONG' ? '🟩' : '🟥'} {side}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            🧩 x{contracts}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            🪙 {instrument}
          </Badge>
          {sessionTags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Net P&L - Main Display */}
        <div className={`p-4 rounded-lg ${pnlBgColor}`}>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {calculations.isOpen ? 'Projected' : 'Net'} P&L
            </div>
            <div className={`text-2xl font-bold ${pnlColor}`}>
              {formatCurrency(calculations.netPnl)}
            </div>
            <div className="text-sm text-gray-600">
              {formatTicks(calculations.totalTicks)} ticks
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-gray-600">Gross P&L</div>
            <div className="font-semibold">{formatCurrency(calculations.grossPnl)}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-gray-600">Fees</div>
            <div className="font-semibold">{formatCurrency(calculations.feesTotal)}</div>
          </div>
          
          {calculations.roiPercent !== null && calculations.roiPercent !== undefined && (
            <div className="p-2 bg-blue-50 rounded">
              <div className="text-gray-600">ROI</div>
              <div className="font-semibold text-blue-600">
                {calculations.roiPercent.toFixed(2)}%
              </div>
            </div>
          )}
          
          {calculations.plannedRMultiple !== null && calculations.plannedRMultiple !== undefined && (
            <div className="p-2 bg-purple-50 rounded">
              <div className="text-gray-600 flex items-center gap-1">
                <Target size={12} />
                Planned R
              </div>
              <div className="font-semibold text-purple-600">
                {calculations.plannedRMultiple.toFixed(2)}
              </div>
            </div>
          )}
          
          {calculations.realizedRMultiple !== null && calculations.realizedRMultiple !== undefined && (
            <div className="p-2 bg-amber-50 rounded">
              <div className="text-gray-600 flex items-center gap-1">
                <Star size={12} />
                Realized R
              </div>
              <div className="font-semibold text-amber-600">
                {calculations.realizedRMultiple.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* MAE/MFE */}
        {(calculations.mfeDollar !== null && calculations.mfeDollar !== undefined) || 
         (calculations.maeDollar !== null && calculations.maeDollar !== undefined) && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">MAE / MFE</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {calculations.maeDollar !== null && calculations.maeDollar !== undefined && (
                <div className="p-2 bg-red-50 rounded">
                  <div className="text-gray-600 flex items-center gap-1">
                    <TrendingDown size={12} />
                    MAE
                  </div>
                  <div className="font-semibold text-red-600">
                    {formatCurrency(calculations.maeDollar)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {calculations.maeTicks?.toFixed(1)} ticks
                  </div>
                </div>
              )}
              
              {calculations.mfeDollar !== null && calculations.mfeDollar !== undefined && (
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-gray-600 flex items-center gap-1">
                    <TrendingUp size={12} />
                    MFE
                  </div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(calculations.mfeDollar)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {calculations.mfeTicks?.toFixed(1)} ticks
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Levels */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Price Levels</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="flex items-center gap-1">
                <Zap size={12} />
                Entry
              </span>
              <span className="font-semibold">{formatPrice(entry)}</span>
            </div>
            
            {exit && (
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Exit</span>
                <span className="font-semibold">{formatPrice(exit)}</span>
              </div>
            )}
            
            {stopLoss && (
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="flex items-center gap-1">
                  <Shield size={12} />
                  Stop Loss
                </span>
                <span className="font-semibold">{formatPrice(stopLoss)}</span>
              </div>
            )}
            
            {profitTarget && (
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="flex items-center gap-1">
                  <Target size={12} />
                  Target
                </span>
                <span className="font-semibold">{formatPrice(profitTarget)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Info */}
        {(startTime || endTime) && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Clock size={12} />
              Timing
            </div>
            <div className="text-sm space-y-1">
              {startTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Start</span>
                  <span>{startTime}</span>
                </div>
              )}
              {endTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">End</span>
                  <span>{endTime}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span className="text-gray-600">Duration</span>
                <span>{calculateDuration()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trade Rating */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Trade Rating</div>
          <div className="flex items-center justify-between">
            {renderStarRating(tradeRating)}
            <span className="text-sm text-gray-600">{tradeRating}/5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichSummaryPanel;