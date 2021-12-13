export class GetAllApiRequest {
  fields: string[];
  states: string[];
  limit: number;
  skip: number;
  from: string;
  to: string;
  type: Record<string, any>;
  rating: number;
}
