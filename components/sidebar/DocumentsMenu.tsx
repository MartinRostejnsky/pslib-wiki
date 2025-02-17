"use client";

import { useAtomValue } from "jotai";
import { currentCollectionAtom } from "@/atoms";
import { SidebarMenu } from "@/components/ui/sidebar";
import Folder from "@/components/sidebar/Folder";
import DocumentButton from "@/components/sidebar/document/DocumentButton";

export default function DocumentsMenu() {
  const currentCollection = useAtomValue(currentCollectionAtom);
  const folderNames = currentCollection?.folders.map((x) => {
    return { id: x.id, name: x.name };
  });

  return (
    <SidebarMenu>
      {currentCollection?.folders.map((folder) => (
        <Folder key={folder.id} folder={folder} folderNames={folderNames} />
      ))}

      {currentCollection?.documents.map((item) => (
        <DocumentButton
          key={item.id}
          item={item}
          folders={folderNames}
          submenu={false}
        />
      ))}
    </SidebarMenu>
  );
}
