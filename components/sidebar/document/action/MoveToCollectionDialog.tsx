import { DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";
import { MoveDocument, MoveToCollection } from "../../actions";
import { useAtom, useAtomValue } from "jotai";
import { collectionsAtom, currentCollectionAtom } from "@/atoms";

export default function MoveToCollectionDialog() {
    const {
        item,
    } = useContext(DocumentContext);

    const [currentCollection, setCurrentCollection] = useAtom(
        currentCollectionAtom,
      );

      const collections = useAtomValue(collectionsAtom);
    
    return (
        <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Move to Collection
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {collections.map((collection) => (
                    <DropdownMenuItem
                      key={collection.id}
                      onClick={() => {
                        MoveToCollection(item.id, collection.id);

                        const docIndex = currentCollection.documents.findIndex(
                          (x) => x.id === item.id,
                        );

                        if (docIndex !== -1) {
                          setCurrentCollection((prevState) => {
                            prevState.documents.splice(docIndex, 1);

                            return { ...prevState };
                          });
                        } else {
                          for (
                            let i = 0;
                            i < currentCollection.folders.length;
                            i++
                          ) {
                            const folder = currentCollection.folders[i];

                            const docIndex = folder.documents.findIndex(
                              (x) => x.id === item.id,
                            );
                            if (docIndex === -1) continue;

                            setCurrentCollection((prevState) => {
                              prevState.folders[i].documents.splice(
                                docIndex,
                                1,
                              );

                              return { ...prevState };
                            });
                          }
                        }
                      }}
                    >
                      {collection.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
    )
}