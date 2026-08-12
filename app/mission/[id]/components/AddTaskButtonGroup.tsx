"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { AddTaskDrawer } from "./AddTaskButton";
import { useMission } from "@/contexts/mission-context";
import { FilterDropDown } from "./FilterDropDown";

export function AddTaskGroup() {
  return (
    <ButtonGroup>
      <Button variant="outline">Select Tasks</Button>
      <FilterDropDown />
      <AddTaskDrawer />
    </ButtonGroup>
  );
}
