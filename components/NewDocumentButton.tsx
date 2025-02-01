"use client"

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {Plus} from "lucide-react";
import {createDocument} from "@/app/actions";

export default function NewDocumentButton() {
    const [name, setName] = useState("");

    function newDocument() {
        createDocument(name)
            .then(() => {
                console.log("create a new document");
            });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton>New Document <Plus className={"ml-auto"} /></SidebarMenuButton>
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
                    <Button type={"submit"} onClick={newDocument}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}