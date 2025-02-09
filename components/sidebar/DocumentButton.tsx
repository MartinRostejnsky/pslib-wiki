"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import DocumentActionButton from "@/components/sidebar/DocumentActionButton";
import { usePathname } from "next/navigation";

export default function DocumentButton({
  item,
  folders,
  submenu = false,
}: {
  item: { id: string; name: string };
  folders: { id: string; name: string }[];
  submenu: boolean;
}) {
  const pathname = usePathname();

  const linkId = item.id.split(":")[1];

  if (submenu) {
    return (
      <SidebarMenuSubItem className={"relative"}>
        <SidebarMenuSubButton
          asChild
          isActive={pathname.split("/").pop() === linkId}
        >
          <Link href={`/doc/${linkId}`}>{item.name}</Link>
        </SidebarMenuSubButton>
        <SignedIn>
          <DocumentActionButton item={item} folders={folders} key={item.id} />
        </SignedIn>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={pathname.split("/").pop() === linkId}
      >
        <Link href={`/doc/${linkId}`}>{item.name}</Link>
      </SidebarMenuButton>
      <SignedIn>
        <DocumentActionButton item={item} folders={folders} key={item.id} />
      </SignedIn>
    </SidebarMenuItem>
  );
}
