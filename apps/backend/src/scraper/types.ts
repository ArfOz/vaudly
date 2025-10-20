export interface EventInput {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    lat?: number;
    lon?: number;
    swiss?: { x: number; y: number };
  };
  externalLink?: string;
  raw?: any;
}
