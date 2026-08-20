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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { session } = useSession();
  const router = useRouter();

  const [missionData, setMissionData] = useState<Mission | null | undefined>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_completed: false,
    state: "IN_PROGRESS",
    expected_budget: null as number | null,
    real_budget: null as number | null,
  });

  useEffect(() => {
    if (missionId && isEdit) {
      const mission = getMissionById(missionId);

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
  }, [isEdit, missionId, missionLoading, getMissionById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "expected_budget" || name === "real_budget"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      toast.error("Add a name to your mission");
      return;
    }

    const supabase = createClient();

    if (!isEdit) {
      const { error, data }: { error: any; data: Mission | null } =
        await supabase
          .from("missions")
          .insert({
            ...formData,
            user_id: session?.user.id,
          })
          .select()
          .single();

      if (error) {
        toast.error(`Error creating mission: ${error.message}`);
        return;
      }

      toast.success("Mission created successfully!");
      router.push(`/mission/${data.id}`);
      return;
    }

    const { error } = await supabase
      .from("missions")
      .update({
        ...formData,
        user_id: session?.user.id,
      })
      .eq("id", missionId);

    if (error) {
      toast.error(`Error editing mission: ${error.message}`);
      return;
    }

    toast.success("Mission edited successfully!");
    router.push(`/mission/${missionId}`);
  };

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {!isEdit ? (
              "Create a new mission"
            ) : (
              <>
                Edit your{" "}
                <Link
                  href={`/mission/${missionId}`}
                  className="text-primary italic underline underline-offset-4 transition-colors hover:text-primary/80"
                >
                  Mission
                </Link>
              </>
            )}
          </h1>

          <p className="mt-2 font-body text-muted-foreground">
            {isEdit
              ? "Update the details and settings for this mission."
              : "Set up your mission and define what you want to accomplish."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mission details */}
          <Card className="border-primary/15 shadow-sm">
            <CardHeader className="border-b bg-primary/[0.025]">
              <CardTitle className="font-heading text-xl">
                Mission details
              </CardTitle>

              <CardDescription className="font-body">
                Give your mission a clear name and description.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-body font-medium"
                >
                  Mission name
                </Label>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Build my portfolio"
                  required
                  className="h-11 font-body transition-colors focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="font-body font-medium"
                >
                  Description{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>

                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what you want to accomplish..."
                  className="min-h-32 resize-y font-body transition-colors focus-visible:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission settings */}
          <Card className="border-primary/15 shadow-sm">
            <CardHeader className="border-b bg-primary/[0.025]">
              <CardTitle className="font-heading text-xl">
                Mission settings
              </CardTitle>

              <CardDescription className="font-body">
                Control the current state and completion status.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="font-body font-medium"
                >
                  State
                </Label>

                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: value,
                    }))
                  }
                >
                  <SelectTrigger
                    id="state"
                    className="h-11 w-full font-body focus:ring-primary"
                  >
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="IN_PROGRESS">
                      In progress
                    </SelectItem>
                    <SelectItem value="COMPLETED">
                      Completed
                    </SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
{/* 
              <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/10 bg-primary/[0.035] p-5">
                <div className="space-y-1">
                  <Label
                    htmlFor="is_completed"
                    className="cursor-pointer font-body font-medium"
                  >
                    Mark as completed
                  </Label>

                  <p className="font-body text-sm text-muted-foreground">
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
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div> */}
            </CardContent>
          </Card>

          {/* Budget */}
          <Card className="border-primary/15 shadow-sm">
            <CardHeader className="border-b bg-primary/[0.025]">
              <CardTitle className="font-heading text-xl">
                Budget
              </CardTitle>

              <CardDescription className="font-body">
                Optionally keep track of your expected and real budget.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="expected_budget"
                    className="font-body font-medium"
                  >
                    Expected budget{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
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
                    className="h-11 font-body focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="real_budget"
                    className="font-body font-medium"
                  >
                    Real budget{" "}
                    <span className="font-normal text-muted-foreground">
                      (Optional)
                    </span>
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
                    className="h-11 font-body focus-visible:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-primary/10 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="font-body"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="font-body font-semibold shadow-sm"
            >
              {!isEdit ? "Create mission" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}