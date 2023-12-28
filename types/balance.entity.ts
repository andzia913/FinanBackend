export interface BalanceEntity {
  id?: string;
  user_email?: string;
  type_name: string;
  id_type: string;
  date: Date;
  value: number;
  category_name: string;
  id_category: string;
  comment: string;
  planned?: number;
}

export interface SumOfCostsAndIncomes {
  balanceCostSum: number;
  balanceIncomeSum: number;
}
