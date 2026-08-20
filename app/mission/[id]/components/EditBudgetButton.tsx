import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import React from "react";
import { toast } from "sonner";

export default function EditBudgetButton({
  missionId,
  missionName,
  children
}: {
  missionId: string;
  missionName: string;
  children: string | React.ReactElement;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastLoading = toast.loading("Updating Current Budget");

    const formData = new FormData(e.currentTarget);
    const budget = formData.get("budget");

    console.log({
      missionId,
      budget,
    });

    // Update budget in Supabase here
    const supabase = createClient();
    const { error, data } = await supabase
      .from("missions")
      .update({ real_budget: budget })
      .eq("id", missionId)
      .select();

    console.log("UPDATE RESULT:", {
      missionId,
      budget,
      error,
      data,
    });

    if (error) {
      console.log("Error updating current budget", error.message);
      toast.error(`Error updating mission: ${error.message}`);
      toast.dismiss(toastLoading);

      return;
    }

    console.log("Data", data);

    toast.dismiss(toastLoading);
    toast.success("Budget updated succcessfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {children}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Change your current budget for: <span className="italic leading-tight">{missionName}</span>
            </DialogTitle>

            <DialogDescription>
              Changing your current budget will change the amount of money
              available for this mission and everything will be recalculated.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <Label htmlFor="budget">Budget</Label>

              <Input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your budget"
                required
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
