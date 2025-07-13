export interface Activity {
  type: 'Run' | 'Hike' | 'Cycle';
  coordinates: [number, number][];
  timestamps: number[];
}
