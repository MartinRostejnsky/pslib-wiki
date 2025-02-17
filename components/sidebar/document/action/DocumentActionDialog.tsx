"use client";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { MoreHorizontal } from "lucide-react";
import DocumentDeletionDialog from "./DocumentDeletionDialog";
import DocumentRenameDialog from "./DocumentRenameDialog";
import MoveToFolderDialog from "./MoveToFolderDialog";
import MoveToCollectionDialog from "./MoveToCollectionDialog";

export default function DocumentActionDialog() {
  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction className="right-3 top-1">
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <span>Edit Name</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <span>Delete Document</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <MoveToFolderDialog />
            <MoveToCollectionDialog />
          </DropdownMenuContent>
        </DropdownMenu>
        <DocumentRenameDialog />  
        <DocumentDeletionDialog />
      </AlertDialog>
    </Dialog>
  );
}
