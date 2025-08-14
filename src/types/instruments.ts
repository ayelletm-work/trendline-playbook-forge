export interface InstrumentPreset {
  symbol: string;
  name: string;
  tickSize: number;
  tickValue: number;
  contractMultiplier: number;
  active: boolean;
}

export const instrumentPresets: Record<string, InstrumentPreset> = {
  'MGC1!': {
    symbol: 'MGC1!',
    name: 'Micro Gold',
    tickSize: 0.1,
    tickValue: 1, // $1 per tick
    contractMultiplier: 10, // 10 troy oz
    active: true
  },
  'MCL1!': {
    symbol: 'MCL1!',
    name: 'Micro Crude',
    tickSize: 0.01,
    tickValue: 1,
    contractMultiplier: 100,
    active: false // prepare but keep inactive
  }
};

export const defaultInstrument = 'MGC1!';