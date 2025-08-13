export interface JournalData {
  date: string;
  session: string;
  setupType: string;
  bullets: string[];
  side: 'LONG' | 'SHORT';
  entry: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  contracts: string;
  risk: string;
  rewardPotential: string;
  positives: string[];
  negatives: string[];
  tags: string[];
}

export const generateJournalText = (data: JournalData): string => {
  const bulletPoints = data.bullets.filter(bullet => bullet.trim()).map(bullet => `📍 ${bullet}`).join('\n');
  const positivePoints = data.positives.filter(positive => positive.trim()).map(positive => `✅ ${positive}`).join('\n');
  const negativePoints = data.negatives.filter(negative => negative.trim()).map(negative => `❌ ${negative}`).join('\n');
  const tagsList = data.tags.map(tag => tag).join('\n');

  return `📅 Date: ${data.date}
🕒 Session: ${data.session}
Setup Type: ${data.setupType}
${bulletPoints}

📈 Trade Details

Side: ${data.side}

Entry: ${data.entry}

Stop Loss: ${data.stopLoss}

Take Profit: TP1 – ${data.takeProfit1}, TP2 – ${data.takeProfit2}

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
  session: 'London Open',
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
  contracts: '0.5 lots',
  risk: '$500',
  rewardPotential: '3:1 RR',
  positives: [
    'Waited for proper confirmation',
    'Risk management followed'
  ],
  negatives: [
    'Could have been more patient on entry'
  ],
  tags: ['Patience', 'Risk Management', 'Technical Analysis']
};