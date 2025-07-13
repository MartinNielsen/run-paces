export type ActivityType = 'Run' | 'Hike' | 'Cycle' | 'Walking' | 'Rucking' | string;

export interface Activity {
  type: ActivityType;
  coordinates: [number, number][];
  timestamps: number[];
}
