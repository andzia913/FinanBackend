export interface GoalEntity {
  id?: string;
  user_email?: string;
  goal_name: string;
  value: number;
  date: Date;
}

export interface GoalEntityWithSum extends GoalEntity {
  currValue: number;
}

export interface SumOfGoals {
  currValue: number;
  goal_name: string;
}
