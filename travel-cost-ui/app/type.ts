// app/types.ts
export type Person = {
  id: number;
  name: string;
  deposit: number;
};

export type Expense = {
  id: number;
  item: string;
  description: string;
  amount: number;
};

export type Trip = {
  id: number;
  name: string;
  currency: string;
  people: Person[];
  expenses: Expense[];
};