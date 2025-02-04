"use client"

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {Plus} from "lucide-react";
import {createFolder} from "@/app/actions";
import { useRouter } from "next/navigation";

export default function NewFolderButton() {
    const [name, setName] = useState("");
    const router = useRouter();

    async function newFolder() {
        await createFolder(name);
        router.refresh();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton>New Folder <Plus className={"ml-auto"}/></SidebarMenuButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={"folderName"} className={"text-right"}>Folder name</Label>
                        <Input id={"folderName"} placeholder={"Name"} className={"col-span-3"}
                               onChange={(event) => setName(event.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type={"submit"} onClick={newFolder}>Create</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}