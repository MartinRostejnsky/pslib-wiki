"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import DocumentButton from "@/components/sidebar/DocumentButton";
import { FolderDocuments } from "@/components/sidebar/DocumentsMenu";
import { usePathname } from "next/navigation";

export default function Folder({
  folder,
  folderNames,
}: {
  folder: FolderDocuments;
  folderNames: { id: string; name: string }[];
}) {
  const pathname = usePathname();

  const linkIds: Set<string> = new Set();

  folder.documents.map((document) => {
    linkIds.add(document.id.toString().split(":").pop() ?? "");
  });

  return (
    <Collapsible
      className={"group/collapsible"}
      defaultOpen={linkIds.has(pathname.split("/").pop() ?? "")}
      asChild
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={folder.name}>
            <span>{folder.name}</span>
            <ChevronDown
              className={
                "ml-auto -rotate-90 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-0"
              }
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.documents.map((document) => (
              <DocumentButton
                key={document.id}
                item={document}
                folders={folderNames}
                submenu={true}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
