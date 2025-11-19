export interface ActivityResponse {
  id: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  };
}
