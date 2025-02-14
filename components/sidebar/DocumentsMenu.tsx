"use client";

import { GetContent } from "@/components/sidebar/actions";
import { useAtom, useAtomValue } from "jotai";
import { collectionContentsAtom, selectedCollectionAtom } from "@/atoms";
import { useEffect } from "react";

export default function DocumentsMenu() {
  const currentCollectionId = useAtomValue(selectedCollectionAtom);
  const [collectionContents, setCollectionContents] = useAtom(
    collectionContentsAtom,
  );
  useEffect(() => {
    GetContent(currentCollectionId).then((result) => {
      //   if (!result) return;
      //   const collection = result[0][0];
      //   if (!collection) return;
      //   const existingIndex = collectionContents.findIndex(
      //     (x) => x.id === collection.id,
      //   );
      //   if (existingIndex !== -1) {
      //     collectionContents.splice(existingIndex, 1);
      //   }
      //   setCollectionContents([...collectionContents, collection]);
      //   console.log(collectionContents);
    });
  }, [currentCollectionId]);

  return <div></div>;
}
