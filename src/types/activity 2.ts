export interface Activity {
  id: number;
  name: string;
  slug: string;
  imagePath: string;
  description: string;
  color: string;
  initialPosition: { x: number; y: number; z: number };
  initialRotation: { x: number; y: number; z: number };
}

export interface ActivitiesData {
  activities: Activity[];
}
