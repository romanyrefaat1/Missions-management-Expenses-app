import { Pencil } from "lucide-react";
import { AddTaskDrawer } from "./AddTaskButton";
import { Task } from "@/types/types";

export default function EditTaskButton ({task}: {task: Task}) {

    return (
        <AddTaskDrawer isEdit={true} task={task} editTaskButtonText={<Pencil />}/>
    )
}