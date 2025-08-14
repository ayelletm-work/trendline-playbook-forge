import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info, Plus, Trash2 } from 'lucide-react';
import { instrumentPresets } from '../types/instruments';

interface TradeFill {
  id: string;
  instrument: string;
  quantity: number;
  price: number;
  fee: number;
  commission: number;
  // Computed fields
  multiplier: number;
  position: number;
  adjustedCost: number;
  adjustedProceed: number;
  grossPnl: number;
}

interface TradeTableProps {
  onDataChange: (fills: TradeFill[]) => void;
}

const TradeTable: React.FC<TradeTableProps> = ({ onDataChange }) => {
  const [fills, setFills] = useState<TradeFill[]>([
    {
      id: '1',
      instrument: 'MGC',
      quantity: 1,
      price: 0,
      fee: 0.5,
      commission: 0,
      multiplier: 10.0,
      position: 1,
      adjustedCost: 0,
      adjustedProceed: 0,
      grossPnl: 0
    }
  ]);

  // Calculate computed fields for a single fill
  const calculateFill = (fill: TradeFill, allFills: TradeFill[]): TradeFill => {
    const preset = instrumentPresets[fill.instrument + '1!'] || instrumentPresets['MGC1!'];
    const multiplier = preset.contractMultiplier;
    const qty = fill.quantity;
    const px = fill.price;
    const costs = fill.fee + fill.commission;

    let adjustedCost = 0;
    let adjustedProceed = 0;
    let grossPnl = 0;

    // Calculate adjusted cost/proceed
    if (qty > 0) {
      // BUY/LONG
      adjustedCost = Math.abs(qty) * px * multiplier + costs;
    } else if (qty < 0) {
      // SELL/SHORT
      adjustedProceed = Math.abs(qty) * px * multiplier - costs;
    }

    // Calculate gross P&L (simplified for single fills - would need FIFO matching for real P&L)
    // For now, show 0 unless there's a clear opposite position
    const oppositeFills = allFills.filter(f => 
      f.id !== fill.id && 
      f.instrument === fill.instrument && 
      Math.sign(f.quantity) !== Math.sign(qty) &&
      f.price > 0
    );

    if (oppositeFills.length > 0 && px > 0) {
      // Simple P&L calculation for demonstration
      const oppositePrice = oppositeFills[0].price;
      const sideDir = qty > 0 ? 1 : -1;
      const matchedQty = Math.min(Math.abs(qty), Math.abs(oppositeFills[0].quantity));
      grossPnl = (px - oppositePrice) * sideDir * multiplier * matchedQty;
    }

    return {
      ...fill,
      multiplier,
      position: qty,
      adjustedCost,
      adjustedProceed,
      grossPnl
    };
  };

  // Recalculate all fills when data changes
  useEffect(() => {
    const updatedFills = fills.map(fill => calculateFill(fill, fills));
    if (JSON.stringify(updatedFills) !== JSON.stringify(fills)) {
      setFills(updatedFills);
    }
    onDataChange(updatedFills);
  }, [fills.map(f => `${f.instrument}-${f.quantity}-${f.price}-${f.fee}-${f.commission}`).join('|')]);

  const updateFill = (id: string, field: keyof TradeFill, value: any) => {
    setFills(prev => prev.map(fill => {
      if (fill.id === id) {
        const updated = { ...fill, [field]: value };
        return calculateFill(updated, prev);
      }
      return fill;
    }));
  };

  const addFill = () => {
    const newFill: TradeFill = {
      id: Date.now().toString(),
      instrument: 'MGC',
      quantity: 1,
      price: 0,
      fee: 0.5,
      commission: 0,
      multiplier: 10.0,
      position: 1,
      adjustedCost: 0,
      adjustedProceed: 0,
      grossPnl: 0
    };
    setFills(prev => [...prev, newFill]);
  };

  const removeFill = (id: string) => {
    setFills(prev => prev.filter(fill => fill.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getRowColor = (quantity: number) => {
    if (quantity > 0) return 'border-l-4 border-l-success';
    if (quantity < 0) return 'border-l-4 border-l-destructive';
    return '';
  };

  const totals = fills.reduce((acc, fill) => ({
    adjustedCost: acc.adjustedCost + fill.adjustedCost,
    adjustedProceed: acc.adjustedProceed + fill.adjustedProceed,
    grossPnl: acc.grossPnl + fill.grossPnl
  }), { adjustedCost: 0, adjustedProceed: 0, grossPnl: 0 });

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 px-8 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-titillium text-tit-xl font-semibold text-foreground">
            🪙 Trade Fills
          </CardTitle>
          <Button 
            onClick={addFill}
            size="sm"
            variant="outline"
            className="rounded-8 font-open-sans text-t0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Fill
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">Instrument</th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">Quantity</th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">Price, $</th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">Fee, $</th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">Commission, $</th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Multiplier <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Auto-calculated from instrument</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Position <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Auto-calculated (equals quantity)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Adj. Cost <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>|qty| × price × multiplier + costs (for buys)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Adj. Proceed <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>|qty| × price × multiplier - costs (for sells)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left py-3 px-2 font-open-sans text-t-1 font-medium text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          Gross P&L <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Realized when closing fills exist</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {fills.map((fill) => (
                <tr key={fill.id} className={`border-b border-border hover:bg-accent/50 ${getRowColor(fill.quantity)}`}>
                  <td className="py-3 px-2">
                    <Select
                      value={fill.instrument}
                      onValueChange={(value) => updateFill(fill.id, 'instrument', value)}
                    >
                      <SelectTrigger className="w-20 h-8 rounded-6 font-open-sans text-t0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MGC">MGC</SelectItem>
                        <SelectItem value="MCL">MCL</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={fill.quantity}
                        onChange={(e) => updateFill(fill.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 h-8 rounded-6 font-open-sans text-t0"
                        step="1"
                      />
                      <Badge 
                        variant={fill.quantity >= 0 ? "default" : "destructive"}
                        className="text-xs rounded-4 font-open-sans"
                      >
                        {fill.quantity >= 0 ? 'LONG' : 'SHORT'}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={fill.price}
                      onChange={(e) => updateFill(fill.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24 h-8 rounded-6 font-open-sans text-t0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={fill.fee}
                      onChange={(e) => updateFill(fill.id, 'fee', parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 rounded-6 font-open-sans text-t0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={fill.commission}
                      onChange={(e) => updateFill(fill.id, 'commission', parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 rounded-6 font-open-sans text-t0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-open-sans text-t0 text-muted-foreground bg-muted px-2 py-1 rounded-4">
                      {fill.multiplier.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-open-sans text-t0 font-medium ${
                      fill.position > 0 ? 'text-success' : fill.position < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {fill.position > 0 ? '+' : ''}{fill.position}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-open-sans text-t0 ${
                      fill.adjustedCost > 0 ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {fill.adjustedCost > 0 ? formatCurrency(fill.adjustedCost) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-open-sans text-t0 ${
                      fill.adjustedProceed > 0 ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {fill.adjustedProceed > 0 ? formatCurrency(fill.adjustedProceed) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-open-sans text-t0 font-medium ${
                      fill.grossPnl > 0 ? 'text-success' : 
                      fill.grossPnl < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {fill.grossPnl !== 0 ? formatCurrency(fill.grossPnl) : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {fills.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFill(fill.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="border-t-2 border-border bg-accent/30 font-medium">
                <td colSpan={7} className="py-3 px-2 font-open-sans text-t0 font-semibold text-foreground">
                  Totals
                </td>
                <td className="py-3 px-2">
                  <span className="font-open-sans text-t0 font-semibold text-foreground">
                    {formatCurrency(totals.adjustedCost)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="font-open-sans text-t0 font-semibold text-foreground">
                    {formatCurrency(totals.adjustedProceed)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`font-open-sans text-t0 font-semibold ${
                    totals.grossPnl > 0 ? 'text-success' : 
                    totals.grossPnl < 0 ? 'text-destructive' : 'text-foreground'
                  }`}>
                    {formatCurrency(totals.grossPnl)}
                  </span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeTable;