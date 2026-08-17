"use client";

import * as React from "react";
import {
  Building2Icon,
  Calendar,
  CheckSquare,
  CircleDot,
  CreditCardIcon,
  Satellite,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterTasksOptions, useFilteredTasks } from "../../contexts/filtered-tasks-context";

export function FilterDropDown() {
  const {filterType, setFilterType} = useFilteredTasks()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Filter Type</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filterType}
            onValueChange={setFilterType}
          >
            <DropdownMenuRadioItem value="DATE">
              <Calendar />
              Date
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="IS_COMPLETED">
              <CheckSquare />
              Completed
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="STATE">
              <CircleDot />
              Current State
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
