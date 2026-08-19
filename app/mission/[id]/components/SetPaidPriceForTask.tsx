

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
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export function SetPaidPriceForTaskDialog({taskId}: {taskId: string}) {
    const [taskPaidPrice,setTaskPaidPrice] = useState<number>(0)

    const [error, setError] = useState<null | string>(null)

    const handleSubmit = async ()=> {

        if (taskPaidPrice === 0) {
            setError("Your task's paid price must be higher than 0")
            console.error("Your task's paid price must be higher than 0")
            return;
        }
        
        const supabase = createClient()

        const {error} = await supabase.from("tasks").update({
            paid_price: taskPaidPrice
        }).eq("id", taskId)

        if (error) {
            setError(`Error editing task: ${error.message}`)
            console.error(`Error editing task: ${error.message}`)
            return;
        }

        toast.success("Price set successfully")
    }
    
  return (
    <Dialog>
      <DialogTrigger >
        <Button size={"sm"} variant={"outline"}>Set paid price</Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set the task's paid price</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="paid_price" className="sr-only">
              Link
            </Label>
            <Input
              id="paid_price"
              value={taskPaidPrice}
              type="number"
              onChange={(e)=> setTaskPaidPrice(e.target.value)}
            />
          </div>
        </div>

        {error && <MyAlert title={error} variant="error" />}
        <DialogFooter className="sm:justify-start">
          <DialogClose >
            <Button variant={"outline"}>Close</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
