"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useMission } from "@/contexts/mission-context";
import type { Task, TaskState } from "@/types/types";

export type FilterTasksOptions = "DATE" | "IS_COMPLETED" | "STATE";


export type FilteredTasksResult =
  | {
      type: "DATE";
      tasks: Task[];
    }
  | {
      type: "IS_COMPLETED";
      completed: Task[];
      not_completed: Task[];
    }
  | {
      type: "STATE";
      pending: Task[];
      in_progress: Task[];
      completed: Task[];
    };

interface FilteredTasksContextValue {
  filteredTasks: FilteredTasksResult;
  filterType: FilterTasksOptions;
  searchKeyword: string;

  setFilterType: React.Dispatch<
    React.SetStateAction<FilterTasksOptions>
  >;

  setSearchKeyword: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const FilteredTasksContext =
  createContext<FilteredTasksContextValue | null>(null);

const FilteredTasksProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { tasks } = useMission();

  const [filterType, setFilterType] =
    useState<FilterTasksOptions>("DATE");

  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredTasks = useMemo<FilteredTasksResult>(() => {
    let result = [...tasks];

    /* Search */

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();

      result = result.filter((task) => {
        return (
          task.name.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword) ||
          String(task.count).includes(keyword)
        );
      });
    }

    /* DATE */

    if (filterType === "DATE") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      return {
        type: "DATE",
        tasks: result,
      };
    }

    /* IS_COMPLETED */

    if (filterType === "IS_COMPLETED") {
      const completed: Task[] = [];
      const not_completed: Task[] = [];

      for (const task of result) {
        if (task.is_completed === true) {
          completed.push(task);
        } else {
          not_completed.push(task);
        }
      }

      return {
        type: "IS_COMPLETED",
        completed,
        not_completed,
      };
    }

    /* STATE */

    const pending: Task[] = [];
    const in_progress: Task[] = [];
    const completed: Task[] = [];

    for (const task of result) {
      if (task.state === "PENDING") {
        pending.push(task);
      } else if (task.state === "IN_PROGRESS") {
        in_progress.push(task);
      } else if (task.state === "COMPLETED") {
        completed.push(task);
      }
    }

    return {
      type: "STATE",
      pending,
      in_progress,
      completed,
    };
  }, [tasks, filterType, searchKeyword]);

  return (
    <FilteredTasksContext.Provider
      value={{
        filteredTasks,
        filterType,
        searchKeyword,
        setFilterType,
        setSearchKeyword,
      }}
    >
      {children}
    </FilteredTasksContext.Provider>
  );
};

export const useFilteredTasks = () => {
  const context = useContext(FilteredTasksContext);

  if (!context) {
    throw new Error(
      "useFilteredTasks must be used inside a FilteredTasksProvider"
    );
  }

  return context;
};

export default FilteredTasksProvider;