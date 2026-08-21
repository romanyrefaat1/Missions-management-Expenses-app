"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useMission } from "@/contexts/mission-context";
import type { Task } from "@/types/types";

export type FilterTasksOptions = "DATE" | "IS_COMPLETED" | "STATE";

export type FilteredTasksResult =
  | { type: "SEARCH"; tasks: Task[] }
  | { type: "DATE"; tasks: Task[] }
  | { type: "IS_COMPLETED"; completed: Task[]; not_completed: Task[] }
  | { type: "STATE"; pending: Task[]; in_progress: Task[]; completed: Task[] };

interface FilteredTasksContextValue {
  filteredTasks: FilteredTasksResult;
  filterType: FilterTasksOptions;
  searchKeyword: string;
  setFilterType: React.Dispatch<React.SetStateAction<FilterTasksOptions>>;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const FilteredTasksContext = createContext<FilteredTasksContextValue | null>(null);

const VALID_FILTER_TYPES: FilterTasksOptions[] = ["DATE", "IS_COMPLETED", "STATE"];

export const FilteredTasksProvider = ({ children }: { children: ReactNode }) => {
  const { tasks } = useMission();

  // Initialize state lazily from localStorage safely on client render
  const [filterType, setFilterType] = useState<FilterTasksOptions>(() => {
    if (typeof window === "undefined") return "DATE";
    
    const saved = localStorage.getItem("filter-type") as FilterTasksOptions | null;
    return saved && VALID_FILTER_TYPES.includes(saved) ? saved : "DATE";
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("filter-type", filterType);
  }, [filterType]);

  const filteredTasks = useMemo<FilteredTasksResult>(() => {
    let result = [...tasks];

    const keyword = searchKeyword.trim().toLowerCase();

    if (keyword) {
      result = result.filter((task) => {
        const name = task.name?.toLowerCase() ?? "";
        const description = task.description?.toLowerCase() ?? "";
        const count = task.count != null ? String(task.count).toLowerCase() : "";

        return (
          name.includes(keyword) ||
          description.includes(keyword) ||
          count.includes(keyword)
        );
      });

      return { type: "SEARCH", tasks: result };
    }

    if (filterType === "DATE") {
      result.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      return { type: "DATE", tasks: result };
    }

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

      return { type: "IS_COMPLETED", completed, not_completed };
    }

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

    return { type: "STATE", pending, in_progress, completed };
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
    throw new Error("useFilteredTasks must be used inside a FilteredTasksProvider");
  }
  return context;
};

export default FilteredTasksProvider;