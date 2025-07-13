export interface Activity {
  type: 'run' | 'hike' | 'cycle';
  coordinates: [number, number][];
  timestamps: string[];
}

export const mockActivities: Activity[] = [
  {
    type: 'run',
    coordinates: [
      [51.51, -0.1],
      [51.51, -0.12],
      [51.52, -0.12],
      [51.52, -0.1],
    ],
    timestamps: [
      "2025-07-01T10:00:00Z",
      "2025-07-01T10:05:00Z",
      "2025-07-01T10:10:00Z",
      "2025-07-01T10:15:00Z",
    ],
  },
  {
    type: 'hike',
    coordinates: [
      [51.50, -0.05],
      [51.51, -0.06],
      [51.51, -0.07],
    ],
    timestamps: [
      "2025-07-02T11:00:00Z",
      "2025-07-02T11:30:00Z",
      "2025-07-02T12:00:00Z",
    ],
  },
  {
    type: 'cycle',
    coordinates: [
      [51.49, -0.1],
      [51.49, -0.15],
      [51.5, -0.15],
      [51.5, -0.1],
    ],
    timestamps: [
      "2025-07-03T09:00:00Z",
      "2025-07-03T09:15:00Z",
      "2025-07-03T09:30:00Z",
      "2025-07-03T09:45:00Z",
    ],
  },
];
