export interface Person {
  id: number;
  name: string;
  deposit: number;
}

export interface Expense {
  id: number;
  item: string;
  amount: number;
  description?: string;
}

export interface Trip {
  id: number;
  name: string;
  currency: string;
  startDate?: string; // New field
  endDate?: string;   // New field
  type?: 'regular' | 'bulk'; // Added to distinguish trip types
  touristCount?: number;      // Specific to bulk calculations
  feePerPerson?: number;      // Specific to bulk calculations
  people: Person[];
  expenses: Expense[];
}