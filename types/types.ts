export type MissionState = "IN_PROGRESS" | "COMPLETED" | "PENDING";

export interface Mission {
  id: string;
  user_id: string;
  created_at: string;
  end_date: string | null;
  name: string;
  description: string | null;
  is_completed: boolean;
  state: MissionState;
  expected_budget: number | null;
  real_budget: number | null;
  current_paid: number | null;
  image_url: string | null;
}

export type TaskState = "IN_PROGRESS" | "COMPLETED" | "PENDING";

export type Task = {
  id: string;
  user_id: string;
  created_at: string;

  name: string;
  description: string | null;

  expected_price: number | null;
  paid_price: number | null;

  count: number;

  state: TaskState;
  state_before_is_completed_true: TaskState;

  mission: string | null;

  is_completed: boolean | null;
};
