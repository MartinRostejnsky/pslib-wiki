"use client"

import {SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton, SidebarMenuSubItem} from "@/components/ui/sidebar";
import Link from "next/link";
import {SignedIn} from "@clerk/nextjs";
import DocumentActionButton from "@/components/sidebar/DocumentActionButton";
import {usePathname} from "next/navigation";

export default function DocumentButton({item, folders, submenu = false}: { item: { id: string, name: string }, folders: {id: string, name: string}[], submenu: boolean }) {
    const pathname = usePathname();

    if (submenu) {
        return (
            <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton asChild isActive={pathname.split("/").pop() === item.id}>
                    <Link href={`/doc/${item.id}`}>{item.name}</Link>
                </SidebarMenuSubButton>
                <SignedIn>
                    <DocumentActionButton item={item} folders={folders} />
                </SignedIn>
            </SidebarMenuSubItem>
        )
    }

    return (
        <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={pathname.split("/").pop() === item.id}>
                <Link href={`/doc/${item.id}`}>{item.name}</Link>
            </SidebarMenuButton>
            <SignedIn>
                <DocumentActionButton item={item} folders={folders} />
            </SignedIn>
        </SidebarMenuItem>
    )
}