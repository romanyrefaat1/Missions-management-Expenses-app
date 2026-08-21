import { MyAlert } from "@/components/my-alert";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMissionsAll } from "@/contexts/missions-all-context"
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteMissionDialog({ missionId }: { missionId: string }) {
  const { getMissionById } = useMissionsAll()
  const mission = getMissionById(missionId)

  const router = useRouter()

  const [inputValue, setInputValue] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async ()=> {
    if (inputValue !== mission.name) {
        setError("What you typed does not match the mission;s name")
        console.error("Input doesnt match")
        return;
    }

    const supabase = createClient();
    const {error} = await supabase.from("missions").delete().eq("id", mission.id)

    if (error) {
        setError(`Error deleting mission: ${error.message}`)
        console.error(`Error deleting mission: ${error.message}`)
        return;
    }

    toast.success("Deleted mission successfully")
    router.push("/home")
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="p-0">
        <Button variant="ghost"
        className="p-0 h-auto font-normal bg-transparent hover:bg-transparent text-inherit group-hover:text-destructive-foreground focus-visible:ring-0"
        >
          Delete Mission
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Mission</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please rethink your choice carefully.
            <br />
            <br />
            If you still want to delete this mission type in the input box:{" "}
            <span className="font-semibold text-foreground select-none pointer-events-none break-all">
              {mission?.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="grid flex-1 gap-2">
            <Input id="link" value={inputValue} onChange={(e)=> setInputValue(e.target.value)} />
          </div>
          {error && <MyAlert variant="error" title={error}/>}
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
          <Button variant="destructive" className="w-full sm:w-auto" onClick={handleSubmit}>
            Delete Mission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}