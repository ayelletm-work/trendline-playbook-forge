export interface JournalData {
  date: string;
  session: string;
  sessionType: string;
  instrument: string;
  timeframe: string;
  playbook: string;
  playbookGrade: number;
  setupType: string;
  bullets: string[];
  side: 'LONG' | 'SHORT';
  entry: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  exit?: string;
  exitReason?: string;
  contracts: string;
  accountBalance: string;
  risk: string;
  rewardPotential: string;
  positives: string[];
  negatives: string[];
  tags: string[];
  // New fields from the trading interface
  contractsTraded: string;
  points: string;
  ticks: string;
  ticksPerContract: string;
  commissionsAndFees: string;
  netROI: string;
  grossPL: string;
  adjustedCost: string;
  priceMAE: string; // Maximum Adverse Excursion
  priceMFE: string; // Maximum Favorable Excursion
  tradeRating: number; // 1-5 stars
  profitTarget: string;
  initialTarget: string;
  tradeRisk: string;
  plannedRMultiple: string;
  realizedRMultiple: string;
  averageEntry: string;
  averageExit: string;
  entryTime: string;
  exitTime: string;
  bestExitPrice: string;
  bestExitTime: string;
}

export const generateJournalText = (data: JournalData): string => {
  const bulletPoints = data.bullets.filter(bullet => bullet.trim()).map(bullet => `📍 ${bullet}`).join('\n');
  const positivePoints = data.positives.filter(positive => positive.trim()).map(positive => `✅ ${positive}`).join('\n');
  const negativePoints = data.negatives.filter(negative => negative.trim()).map(negative => `❌ ${negative}`).join('\n');
  const tagsList = data.tags.map(tag => tag).join('\n');
  
  const exitSection = data.exit ? `\nExit: ${data.exit}${data.exitReason ? `\nExit Reason: ${data.exitReason}` : ''}` : '';

  return `📅 Date: ${data.date}
🕒 Session: ${data.session}
📊 Session Type: ${data.sessionType}
💰 Instrument: ${data.instrument}
⏰ Timeframe: ${data.timeframe}
📖 Playbook: ${data.playbook} ${data.playbookGrade > 0 ? `(${data.playbookGrade}/5 ⭐)` : ''}
Setup Type: ${data.setupType}
${bulletPoints}

📈 Trade Details

Side: ${data.side}

Entry: ${data.entry}

Stop Loss: ${data.stopLoss}

Take Profit: TP1 – ${data.takeProfit1}, TP2 – ${data.takeProfit2}${exitSection}

Contracts: ${data.contracts}

Risk: ${data.risk}

Reward Potential: ${data.rewardPotential}

🎯 Execution Summary
${positivePoints}
${negativePoints}

🧠 Mental & Rule-Based Tags

${tagsList}`;
};

export const defaultJournalData: JournalData = {
  date: new Date().toLocaleDateString(),
  session: 'London',
  sessionType: '',
  instrument: '',
  timeframe: '',
  playbook: '',
  playbookGrade: 0,
  setupType: '4H MGC Trendline Break',
  bullets: [
    'Clean trendline formed over multiple touches',
    'Volume confirmation on break',
    'SIL support level nearby'
  ],
  side: 'LONG',
  entry: '1.2750',
  stopLoss: '1.2700',
  takeProfit1: '1.2850',
  takeProfit2: '1.2950',
  exit: '',
  exitReason: '',
  contracts: '0.5 lots',
  accountBalance: '5000',
  risk: '$100.00',
  rewardPotential: '3:1 RR',
  positives: [
    'Waited for proper confirmation',
    'Risk management followed'
  ],
  negatives: [
    'Could have been more patient on entry'
  ],
  tags: ['Patience', 'Risk Management', 'Technical Analysis'],
  // New fields with default values
  contractsTraded: '',
  points: '',
  ticks: '',
  ticksPerContract: '',
  commissionsAndFees: '',
  netROI: '',
  grossPL: '',
  adjustedCost: '',
  priceMAE: '',
  priceMFE: '',
  tradeRating: 0,
  profitTarget: '',
  initialTarget: '',
  tradeRisk: '',
  plannedRMultiple: '',
  realizedRMultiple: '',
  averageEntry: '',
  averageExit: '',
  entryTime: '',
  exitTime: '',
  bestExitPrice: '',
  bestExitTime: ''
};