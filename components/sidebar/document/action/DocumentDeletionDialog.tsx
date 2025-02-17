"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DeleteDocument,
} from "@/components/sidebar/actions";
import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";
import { useAtom } from "jotai";
import { currentCollectionAtom } from "@/atoms";

export default function DocumentDeletionDialog() {
    const {
        item
    } = useContext(DocumentContext);

    const [currentCollection, setCurrentCollection] = useAtom(
        currentCollectionAtom,
      );

    return (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you really want to delete {item.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await DeleteDocument(item.id);

                const docIndex = currentCollection.documents.findIndex(
                  (x) => x.id === item.id,
                );
                if (docIndex !== -1)
                  setCurrentCollection((prevState) => {
                    prevState.documents.splice(docIndex, 1);

                    return { ...prevState };
                  });

                for (let i = 0; i < currentCollection.folders.length; i++) {
                  const folder = currentCollection.folders[i];

                  const docIndex = folder.documents.findIndex(
                    (x) => x.id === item.id,
                  );
                  if (docIndex === -1) continue;

                  setCurrentCollection((prevState) => {
                    prevState.folders[i].documents.splice(docIndex, 1);

                    return { ...prevState };
                  });
                  break;
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    )
}