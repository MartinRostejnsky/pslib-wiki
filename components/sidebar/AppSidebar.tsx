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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  collectionsAtom,
  currentCollectionAtom,
  selectedCollectionAtom,
} from "@/atoms";

export default function AppSidebar() {
  const currentCollectionId = useAtomValue(selectedCollectionAtom);
  const [collectionContents, setCollectionContents] = useAtom(collectionsAtom);
  const setCollection = useSetAtom(currentCollectionAtom);

  useEffect(() => {
    GetCollections().then((result) => {
      for (let i = 0; i < result.length; i++) {
        const collection = result[i];

        if (collectionContents.findIndex((x) => x.id === collection.id) !== -1)
          continue;

        setCollectionContents((prevCollections) => [
          ...prevCollections,
          {
            ...collection,
            folders: [],
            documents: [],
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    GetContent(currentCollectionId).then((collection) => {
      if (!collection.id) return;
      const existingIndex = collectionContents.findIndex(
        (x) => x.id === collection.id,
      );
      if (existingIndex !== -1) {
        collectionContents.splice(existingIndex, 1);
      }
      setCollectionContents([...collectionContents, collection]);
      setCollection(collection);
    });
  }, [currentCollectionId]);

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
