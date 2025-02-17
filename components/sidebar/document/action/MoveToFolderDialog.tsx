import { DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";
import { MoveDocument } from "../../actions";
import { useAtom } from "jotai";
import { currentCollectionAtom } from "@/atoms";

export default function MoveToFolderDialog() {
    const { 
        folders,
        item
    } = useContext(DocumentContext);

    
    const [currentCollection, setCurrentCollection] = useAtom(
        currentCollectionAtom,
      );

    return (
        <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to Folder</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {folders.map((folder) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={async () => {
                        await MoveDocument(item.id, folder.id);

                        const docIndex = currentCollection.documents.findIndex(
                          (x) => x.id === item.id,
                        );
                        if (docIndex !== -1) {
                          setCurrentCollection((prevState) => {
                            const folderIndex = prevState.folders.findIndex(
                              (x) => x.id === folder.id,
                            );
                            if (folderIndex === -1) return prevState;

                            prevState.folders[folderIndex].documents.push(
                              currentCollection.documents[docIndex],
                            );
                            prevState.documents.splice(docIndex, 1);

                            return {
                              ...prevState,
                            };
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
                              const finalFolderId = prevState.folders.findIndex(
                                (x) => x.id === folder.id,
                              );
                              if (finalFolderId === -1) return prevState;

                              prevState.folders[finalFolderId].documents.push(
                                prevState.folders[i].documents[docIndex],
                              );
                              prevState.folders[i].documents.splice(
                                docIndex,
                                1,
                              );

                              return {
                                ...prevState,
                              };
                            });

                            break;
                          }
                        }
                      }}
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    key="unassign-folder"
                    onClick={async () => {
                      await MoveDocument(item.id, null);

                      const docIndex = currentCollection.documents.findIndex(
                        (x) => x.id === item.id,
                      );
                      if (docIndex !== -1) return;

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
                          prevState.documents.push(
                            prevState.folders[i].documents[docIndex],
                          );
                          prevState.folders[i].documents.splice(docIndex, 1);

                          return {
                            ...prevState,
                          };
                        });
                        break;
                      }
                    }}
                  >
                    Unassign
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
    )
}