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

type DropdownMenuTypes = "DATE" | "IS_COMPLETED" | "STATE";

export function FilterDropDown() {
  const [filterType, setFilterType] =
    React.useState<DropdownMenuTypes>("IS_COMPLETED");

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
