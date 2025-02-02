"use client"

import {SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import {useState} from "react";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UpdateDocumentName} from "@/components/sidebar/actions";
import {useRouter} from "next/navigation";

export default function SidebarDocumentIcon({item}: { item: { id: string, name: string } }) {
    const [name, setName] = useState("");
    const router = useRouter();

    return (
        <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
                <Link href={`/doc/${item.id}`}>{item.name}</Link>
            </SidebarMenuButton>
            <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                            <MoreHorizontal/>
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                        <DialogTrigger asChild>
                            <DropdownMenuItem>
                                <span>Edit Name</span>
                            </DropdownMenuItem>
                        </DialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit name</DialogTitle>
                        <DialogDescription>Edit the name of a document</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" defaultValue={item.name} onChange={(e) => setName(e.target.value)}
                                   className="col-span-3"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" onClick={async () => {
                                await UpdateDocumentName(item.id, name);
                                router.refresh();
                            }}>
                                Save changes
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarMenuItem>
    )
}