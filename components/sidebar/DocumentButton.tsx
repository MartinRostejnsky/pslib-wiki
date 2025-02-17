"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import DocumentActionDialog from "./document/action/DocumentActionDialog";

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
  const { setOpenMobile } = useSidebar();

  const linkId = item.id.split(":")[1];

  if (submenu) {
    return (
      <SidebarMenuSubItem className={"relative"}>
        <SidebarMenuSubButton
          asChild
          isActive={pathname.split("/").pop() === linkId}
        >
          <Link href={`/doc/${linkId}`} onClick={() => setOpenMobile(false)}>
            {item.name}
          </Link>
        </SidebarMenuSubButton>
        <SignedIn>
          <DocumentActionDialog item={item} folders={folders} key={item.id} />
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
        <Link href={`/doc/${linkId}`} onClick={() => setOpenMobile(false)}>
          {item.name}
        </Link>
      </SidebarMenuButton>
      <SignedIn>
        <DocumentActionDialog item={item} folders={folders} key={item.id} />
      </SignedIn>
    </SidebarMenuItem>
  );
}
