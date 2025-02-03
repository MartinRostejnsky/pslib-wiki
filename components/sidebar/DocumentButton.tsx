"use client"

import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import Link from "next/link";
import {SignedIn} from "@clerk/nextjs";
import DocumentActionButton from "@/components/sidebar/DocumentActionButton";
import {usePathname} from "next/navigation";

export default function DocumentButton({item}: { item: { id: string, name: string }}) {
    const pathname = usePathname();

    return (
        <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={pathname.split("/").pop() === item.id}>
                <Link href={`/doc/${item.id}`}>{item.name}</Link>
            </SidebarMenuButton>
            <SignedIn>
                <DocumentActionButton item={item} />
            </SignedIn>
        </SidebarMenuItem>
    )
}