"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Footer from "@/components/sidebar/Footer";
import Header from "@/components/sidebar/Header";
import DocumentsMenu from "@/components/sidebar/DocumentsMenu";
import { useEffect } from "react";
import { GetCollections, GetContent } from "@/components/sidebar/actions";
import { useAtomValue, useSetAtom } from "jotai";
import {
  collectionsAtom,
  currentCollectionAtom,
  selectedCollectionAtom,
} from "@/atoms";

export default function AppSidebar() {
  const currentCollectionId = useAtomValue(selectedCollectionAtom);
  const setCollectionContents = useSetAtom(collectionsAtom);
  const setCollection = useSetAtom(currentCollectionAtom);

  useEffect(() => {
    GetCollections().then((result) => {
      setCollectionContents(result);
    });
  }, [setCollectionContents]);

  useEffect(() => {
    GetContent(currentCollectionId).then((collection) => {
      if (!collection.id) return;
      setCollectionContents((prevState) => {
        const existingIndex = prevState.findIndex(
          (x) => x.id === collection.id,
        );
        if (existingIndex !== -1) {
          prevState.splice(existingIndex, 1);
        }

        return [...prevState, collection];
      });
      setCollection(collection);
    });
  }, [currentCollectionId, setCollection, setCollectionContents]);

  return (
    <Sidebar>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <DocumentsMenu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
