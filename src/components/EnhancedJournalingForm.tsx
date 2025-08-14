import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info, AlertTriangle, Star } from 'lucide-react';
import { instrumentPresets, defaultInstrument } from '../types/instruments';
import { 
  calculateTrade, 
  validateTradeInputs, 
  TradeCalculationInputs, 
  TradeCalculationResults,
  ValidationWarning,
  formatCurrency,
  formatPrice,
  formatTicks
} from '../utils/tradeCalculations';

interface EnhancedJournalingFormProps {
  onCalculationsChange: (calculations: TradeCalculationResults) => void;
  onFormDataChange: (data: any) => void;
}

interface FormData {
  // Basic trade data
  side: 'LONG' | 'SHORT';
  contracts: string;
  entry: string;
  exit: string;
  stopLoss: string;
  profitTarget: string;
  
  // Account & risk
  accountEquity: string;
  feesPerContract: string;
  
  // MAE/MFE tracking
  highestInTrade: string;
  lowestInTrade: string;
  
  // Timing
  startTime: string;
  endTime: string;
  
  // Instrument settings
  instrumentSymbol: string;
  tickSize: string;
  tickValue: string;
  contractMultiplier: string;
  
  // Quality rating
  tradeRating: number;
  
  // Notes
  setupType: string;
  notes: string;
  tags: string[];
}

const EnhancedJournalingForm: React.FC<EnhancedJournalingFormProps> = ({
  onCalculationsChange,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState<FormData>({
    side: 'LONG',
    contracts: '1',
    entry: '',
    exit: '',
    stopLoss: '',
    profitTarget: '',
    accountEquity: '',
    feesPerContract: '1',
    highestInTrade: '',
    lowestInTrade: '',
    startTime: '',
    endTime: '',
    instrumentSymbol: defaultInstrument,
    tickSize: instrumentPresets[defaultInstrument].tickSize.toString(),
    tickValue: instrumentPresets[defaultInstrument].tickValue.toString(),
    contractMultiplier: instrumentPresets[defaultInstrument].contractMultiplier.toString(),
    tradeRating: 0,
    setupType: '',
    notes: '',
    tags: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculations, setCalculations] = useState<TradeCalculationResults | null>(null);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  // Recalculate when form data changes
  useEffect(() => {
    const inputs: TradeCalculationInputs = {
      side: formData.side,
      contracts: parseFloat(formData.contracts) || 0,
      entry: parseFloat(formData.entry) || 0,
      exit: formData.exit ? parseFloat(formData.exit) : undefined,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      profitTarget: formData.profitTarget ? parseFloat(formData.profitTarget) : undefined,
      accountEquity: formData.accountEquity ? parseFloat(formData.accountEquity) : undefined,
      highestInTrade: formData.highestInTrade ? parseFloat(formData.highestInTrade) : undefined,
      lowestInTrade: formData.lowestInTrade ? parseFloat(formData.lowestInTrade) : undefined,
      feesPerContract: parseFloat(formData.feesPerContract) || 1,
      instrumentSymbol: formData.instrumentSymbol,
      tickSize: parseFloat(formData.tickSize) || instrumentPresets[formData.instrumentSymbol]?.tickSize,
      tickValue: parseFloat(formData.tickValue) || instrumentPresets[formData.instrumentSymbol]?.tickValue,
      contractMultiplier: parseFloat(formData.contractMultiplier) || instrumentPresets[formData.instrumentSymbol]?.contractMultiplier
    };

    if (inputs.entry && inputs.contracts > 0) {
      const result = calculateTrade(inputs);
      setCalculations(result);
      onCalculationsChange(result);
      
      const validationWarnings = validateTradeInputs(inputs);
      setWarnings(validationWarnings);
    }

    onFormDataChange(formData);
  }, [formData, onCalculationsChange, onFormDataChange]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInstrumentChange = (instrumentSymbol: string) => {
    const preset = instrumentPresets[instrumentSymbol];
    if (preset) {
      setFormData(prev => ({
        ...prev,
        instrumentSymbol,
        tickSize: preset.tickSize.toString(),
        tickValue: preset.tickValue.toString(),
        contractMultiplier: preset.contractMultiplier.toString()
      }));
    }
  };

  const setupTypes = [
    'Trendline Break',
    'Retest',
    'Bounce',
    'Breakout',
    'Pullback',
    'Support/Resistance',
    'Counter Trend',
    'Scalp',
    'Swing',
    'Other'
  ];

  const testTrade = () => {
    // Test scenario from requirements
    setFormData(prev => ({
      ...prev,
      side: 'SHORT',
      contracts: '1',
      instrumentSymbol: 'MGC1!',
      entry: '3404.9',
      exit: '3405.2',
      stopLoss: '3407.0',
      profitTarget: '3398.0',
      feesPerContract: '1',
      accountEquity: '34049',
      highestInTrade: '3423.8',
      lowestInTrade: '3389.3'
    }));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Test Button */}
        <Button onClick={testTrade} variant="outline" size="sm">
          Load Test Scenario
        </Button>

        {/* Basic Trade Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Trade Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="side">Side *</Label>
                <Select value={formData.side} onValueChange={(value: 'LONG' | 'SHORT') => handleInputChange('side', value)}>
                  <SelectTrigger id="side">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LONG">LONG 🟩</SelectItem>
                    <SelectItem value="SHORT">SHORT 🟥</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contracts">Contracts *</Label>
                <Input
                  id="contracts"
                  type="number"
                  min="1"
                  value={formData.contracts}
                  onChange={(e) => handleInputChange('contracts', e.target.value)}
                  placeholder="1"
                />
              </div>

              <div>
                <Label htmlFor="instrument">Instrument</Label>
                <Select value={formData.instrumentSymbol} onValueChange={handleInstrumentChange}>
                  <SelectTrigger id="instrument">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(instrumentPresets).filter(([_, preset]) => preset.active).map(([symbol, preset]) => (
                      <SelectItem key={symbol} value={symbol}>
                        {preset.name} ({symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="feesPerContract">Fees/Contract</Label>
                <Input
                  id="feesPerContract"
                  type="number"
                  step="0.01"
                  value={formData.feesPerContract}
                  onChange={(e) => handleInputChange('feesPerContract', e.target.value)}
                  placeholder="1.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Price Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="entry" className="flex items-center gap-1">
                  Entry Price *
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The price at which you entered the trade</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="entry"
                  type="number"
                  step="0.01"
                  value={formData.entry}
                  onChange={(e) => handleInputChange('entry', e.target.value)}
                  placeholder="3404.9"
                />
                {calculations && formData.entry && (
                  <div className="text-xs text-gray-500 mt-1">
                    Notional: {formatCurrency(calculations.positionNotional)}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="exit" className="flex items-center gap-1">
                  Exit Price
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Leave empty for open positions. Shows "Projected" when using Target.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="exit"
                  type="number"
                  step="0.01"
                  value={formData.exit}
                  onChange={(e) => handleInputChange('exit', e.target.value)}
                  placeholder="3405.2"
                />
                {!formData.exit && calculations?.isOpen && (
                  <div className="text-xs text-blue-600 mt-1">Open Position</div>
                )}
              </div>

              <div>
                <Label htmlFor="stopLoss" className="flex items-center gap-1">
                  Stop Loss
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required for R-multiple calculations</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                  placeholder="3407.0"
                />
                {calculations?.tradeRiskDollar && (
                  <div className="text-xs text-red-600 mt-1">
                    Risk: {formatCurrency(calculations.tradeRiskDollar)}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="profitTarget">Profit Target</Label>
                <Input
                  id="profitTarget"
                  type="number"
                  step="0.01"
                  value={formData.profitTarget}
                  onChange={(e) => handleInputChange('profitTarget', e.target.value)}
                  placeholder="3398.0"
                />
                {calculations?.plannedRMultiple && (
                  <div className="text-xs text-green-600 mt-1">
                    Planned R: {calculations.plannedRMultiple.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Validation Warnings */}
            {warnings.map((warning, index) => (
              <Alert key={index} className={`mt-4 ${warning.type === 'error' ? 'border-red-500' : 'border-yellow-500'}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={warning.type === 'error' ? 'text-red-700' : 'text-yellow-700'}>
                  {warning.message}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Live Calculations Display */}
        {calculations && formData.entry && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧮 Live Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-gray-600">Points</div>
                  <div className="font-semibold text-lg">{calculations.points.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-gray-600">Ticks</div>
                  <div className="font-semibold text-lg">{formatTicks(calculations.ticks)}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-gray-600">Gross P&L</div>
                  <div className="font-semibold text-lg text-green-700">{formatCurrency(calculations.grossPnl)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">Net P&L</div>
                  <div className={`font-semibold text-lg ${calculations.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculations.netPnl)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account & Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏦 Account & Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="accountEquity" className="flex items-center gap-1">
                  Account Equity
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required for ROI calculation</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="accountEquity"
                  type="number"
                  step="0.01"
                  value={formData.accountEquity}
                  onChange={(e) => handleInputChange('accountEquity', e.target.value)}
                  placeholder="34049"
                />
                {calculations?.roiPercent !== undefined && (
                  <div className="text-xs text-blue-600 mt-1">
                    ROI: {calculations.roiPercent.toFixed(2)}%
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="highestInTrade">Highest Price in Trade</Label>
                <Input
                  id="highestInTrade"
                  type="number"
                  step="0.01"
                  value={formData.highestInTrade}
                  onChange={(e) => handleInputChange('highestInTrade', e.target.value)}
                  placeholder="3423.8"
                />
              </div>

              <div>
                <Label htmlFor="lowestInTrade">Lowest Price in Trade</Label>
                <Input
                  id="lowestInTrade"
                  type="number"
                  step="0.01"
                  value={formData.lowestInTrade}
                  onChange={(e) => handleInputChange('lowestInTrade', e.target.value)}
                  placeholder="3389.3"
                />
              </div>
            </div>

            {(calculations?.mfeDollar !== undefined || calculations?.maeDollar !== undefined) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Maximum Adverse/Favorable Excursion</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {calculations.maeDollar !== undefined && (
                    <div>
                      <div className="text-red-600">MAE: {formatCurrency(calculations.maeDollar)}</div>
                      <div className="text-xs text-gray-500">{calculations.maeTicks?.toFixed(1)} ticks</div>
                    </div>
                  )}
                  {calculations.mfeDollar !== undefined && (
                    <div>
                      <div className="text-green-600">MFE: {formatCurrency(calculations.mfeDollar)}</div>
                      <div className="text-xs text-gray-500">{calculations.mfeTicks?.toFixed(1)} ticks</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⏱️ Timing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⭐ Trade Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Trade Rating (1-5 stars)</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInputChange('tradeRating', rating)}
                      className="p-1"
                    >
                      <Star 
                        size={20} 
                        className={rating <= formData.tradeRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </Button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{formData.tradeRating}/5</span>
                </div>
              </div>

              <div>
                <Label htmlFor="setupType">Setup Type</Label>
                <Select value={formData.setupType} onValueChange={(value) => handleInputChange('setupType', value)}>
                  <SelectTrigger id="setupType">
                    <SelectValue placeholder="Select setup type" />
                  </SelectTrigger>
                  <SelectContent>
                    {setupTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="What happened? What did I do well? What to improve?"
                  className="min-h-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                ⚙️ Advanced Settings
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showAdvanced && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tickSize">Tick Size</Label>
                  <Input
                    id="tickSize"
                    type="number"
                    step="0.001"
                    value={formData.tickSize}
                    onChange={(e) => handleInputChange('tickSize', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="tickValue">Tick Value ($)</Label>
                  <Input
                    id="tickValue"
                    type="number"
                    step="0.01"
                    value={formData.tickValue}
                    onChange={(e) => handleInputChange('tickValue', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contractMultiplier">Contract Multiplier</Label>
                  <Input
                    id="contractMultiplier"
                    type="number"
                    value={formData.contractMultiplier}
                    onChange={(e) => handleInputChange('contractMultiplier', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedJournalingForm;