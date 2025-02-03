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
import {createDocument} from "@/app/actions";
import {useRouter} from "next/navigation";

export default function NewDocumentButton() {
    const [name, setName] = useState("");
    const router = useRouter();

    async function newDocument() {
        const insertedId = await createDocument(name);
        if (insertedId.id) router.push(`/doc/${insertedId.id}`);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton>New Document <Plus className={"ml-auto"}/></SidebarMenuButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Document</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={"documentName"} className={"text-right"}>Document name</Label>
                        <Input id={"documentName"} placeholder={"Name"} className={"col-span-3"}
                               onChange={(event) => setName(event.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type={"submit"} onClick={newDocument}>Create</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}