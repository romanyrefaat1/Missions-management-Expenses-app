"use client";

import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/contexts/session-context";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Mission } from "@/types/types";
import { useMissionsAll } from "@/contexts/missions-all-context";
import Link from "next/link";

export default function NewMissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <NewMissionForm />
    </Suspense>
  );
}

function NewMissionForm() {
  const searchParams = useSearchParams();

  const missionId = searchParams.get("missionId");
  const isEdit = searchParams.get("edit");
  const { getMissionById, loading: missionLoading } = useMissionsAll();

  const { session, loading: sessionLoading } = useSession();

  const router = useRouter();

  const [missionData, setMissionData] = useState<Mission | null | undefined>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_completed: false,
    state: "IN_PROGRESS",
    expected_budget: null,
    real_budget: null,
  });

  useEffect(() => {
    const handleEditData = () => {
      if (missionId && isEdit) {
        const mission = getMissionById(missionId);

        console.log("Mission", mission);

        setMissionData(mission);
        setFormData({
          name: mission?.name ?? "",
          description: mission?.description ?? "",
          is_completed: mission?.is_completed ?? false,
          state: mission?.state ?? "IN_PROGRESS",
          expected_budget: mission?.expected_budget ?? null,
          real_budget: mission?.real_budget ?? null,
        });
      }
    };

    handleEditData();
  }, [isEdit, missionId, missionLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      toast.error("Add a name to your mission");
      return;
    }

    const supabsase = createClient();

    if (!isEdit) {
      const { error, data }: { error: any; data: Mission | null } =
        await supabsase
          .from("missions")
          .insert({ ...formData, user_id: session?.user.id })
          .select()
          .single();

      if (error) {
        toast.error(`Error creating mission: ${error.message}`);
        console.error("Error creating mission:", error.message);
        return;
      }

      console.log(formData);
      toast.success("Mission Created successfully! Routing to add tasks");
      router.push(`/mission/${data.id}`);
      return;
    }

    const { error }: { error: any; data: Mission | null } = await supabsase
      .from("missions")
      .update({ ...formData, user_id: session?.user.id })
      .eq("id", missionId);

    if (error) {
      toast.error(`Error editing mission: ${error.message}`);
      console.error("Error updating mission:", error.message);
      return;
    }

    console.log(formData);
    toast.success("Mission Edited successfully! Routing to add tasks");
    router.push(`/mission/${missionId}`);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {!isEdit ? (
              "Create a new mission"
            ) : (
              <>
                Edit your{" "}
                <Link className="italic" href={`/mission/${missionId}`}>
                  Mission
                </Link>
              </>
            )}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Edit the details for this mission.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Mission name</Label>

            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Build my portfolio"
              required
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you want to accomplish..."
              className="min-h-32 resize-y"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>

            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  state: value,
                }))
              }
            >
              <SelectTrigger id="state" className="h-12 w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expected_budget">
                Expected budget (Optional)
              </Label>

              <Input
                id="expected_budget"
                name="expected_budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.expected_budget ?? ""}
                onChange={handleChange}
                placeholder="0.00"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="real_budget">
                Real budget (Your Budget) (Optional)
              </Label>

              <Input
                id="real_budget"
                name="real_budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.real_budget ?? ""}
                onChange={handleChange}
                placeholder="0.00"
                className="h-12"
              />
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center justify-between rounded-lg border p-5">
            <div className="space-y-1">
              <Label htmlFor="is_completed">Completed</Label>

              <p className="text-sm text-muted-foreground">
                Mark this mission as completed.
              </p>
            </div>

            <Checkbox
              id="is_completed"
              checked={formData.is_completed}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_completed: checked === true,
                }))
              }
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg">
              {!isEdit ? "Create" : "Edit"} mission
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}