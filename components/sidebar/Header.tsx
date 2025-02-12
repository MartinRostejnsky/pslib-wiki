"use client";

import { SidebarMenu, SidebarMenuButton } from "../ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAtom } from "jotai";
import { collectionsAtom, selectedCollectionAtom } from "@/atoms";
import { getCollections } from "@/components/sidebar/actions";
import { useEffect } from "react";

export default function Header() {
  const [currentCollection, setCurrentCollection] = useAtom(
    selectedCollectionAtom,
  );
  const [collections, setCollections] = useAtom(collectionsAtom);
  useEffect(() => {
    getCollections().then((collections) => {
      setCollections(collections);
    });
  }, []);
  const currentCollectionName =
    collections.find((el) => el.id.toString() === currentCollection)?.name ??
    "Select collection";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              {currentCollectionName}
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            {collections.map((collection) => (
              <DropdownMenuItem
                key={collection.id.toString()}
                onClick={() => {
                  setCurrentCollection(collection.id.toString());
                }}
              >
                <span>{collection.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
