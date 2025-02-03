import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import Link from "next/link";
import {SignedIn} from "@clerk/nextjs";
import DocumentActionButton from "@/components/sidebar/DocumentActionButton";

export default function DocumentButton({item}: { item: { id: string, name: string } }) {
    return (
        <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
                <Link href={`/doc/${item.id}`}>{item.name}</Link>
            </SidebarMenuButton>
            <SignedIn>
                <DocumentActionButton item={item} />
            </SignedIn>
        </SidebarMenuItem>
    )
}