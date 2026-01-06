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
  people: Person[];
  expenses: Expense[];
}