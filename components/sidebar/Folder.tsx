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

export default function Folder({
  folder,
  folderNames,
}: {
  folder: FolderDocuments;
  folderNames: { id: string; name: string }[];
}) {
  return (
    <Collapsible className={"group/collapsible"} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <span>{folder.name}</span>
            <ChevronDown
              className={
                "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
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
