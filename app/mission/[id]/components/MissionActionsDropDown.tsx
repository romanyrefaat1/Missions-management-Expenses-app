"use client"

import { useState } from "react"
import Link from "next/link"
import { EllipsisVertical, PencilIcon, Trash2, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteMissionDialog } from "./DeleteMissionDialog"

export function MissionActionsDropDown({ missionId }: { missionId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon-sm"} className="p-2">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <Link 
              href={`/new-mission?edit=true&missionId=${missionId}`}
              className="flex flex-row items-center gap-2 w-full cursor-pointer hover:no-underline"
            >
              <PencilIcon className="h-4 w-4 group-hover:text-primary" />
              <span>Edit Mission</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem 
            variant="destructive" 
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="group-hover:text-destructive-foreground" />
            <DeleteMissionDialog missionId={missionId} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}