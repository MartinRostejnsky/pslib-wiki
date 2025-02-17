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
import DocumentActionDialog from "./action/DocumentActionDialog";
import DocumentContextProvider from "./context/DocumentContextProvider";

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

  const MenuItem = submenu ? SidebarMenuSubItem : SidebarMenuItem;
  const MenuButton = submenu ? SidebarMenuSubButton : SidebarMenuButton;

  return (
    <DocumentContextProvider item={item} folders={folders}>
      <MenuItem className={`${submenu && "relative" /*zkontrolovat ze to funguje*/}`}>
        <MenuButton
          asChild
          isActive={pathname.split("/").pop() === linkId}
        >
          <Link href={`/doc/${linkId}`} onClick={() => setOpenMobile(false)}>
            {item.name}
          </Link>
        </MenuButton>
        <SignedIn>
          <DocumentActionDialog key={item.id} />
        </SignedIn>
      </MenuItem>
    </DocumentContextProvider>
  );
}
