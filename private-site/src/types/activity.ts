export interface Activity {
  type: 'Running' | 'Hike' | 'Cycle';
  coordinates: [number, number][];
  timestamps: number[];
}
