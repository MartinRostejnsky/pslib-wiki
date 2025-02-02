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
import {DeleteDocument, UpdateDocumentName} from "@/components/sidebar/actions";
import {useRouter} from "next/navigation";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function DocumentButton({item}: { item: { id: string, name: string } }) {
    const [name, setName] = useState("");
    const router = useRouter();

    return (
        <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
                <Link href={`/doc/${item.id}`}>{item.name}</Link>
            </SidebarMenuButton>
            <Dialog>
                <AlertDialog>
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
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem>
                                    <span>Delete Document</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
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
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you really want to delete {item.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove the document.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={async () => {
                                await DeleteDocument(item.id);
                                router.refresh();
                            }}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Dialog>
        </SidebarMenuItem>
    )
}