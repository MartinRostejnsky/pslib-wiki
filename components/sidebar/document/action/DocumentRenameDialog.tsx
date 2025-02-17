import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { DocumentContext } from "../context/DocumentContext";
import { UpdateDocumentName } from "../../actions";
import { useAtom } from "jotai";
import { currentCollectionAtom } from "@/atoms";

export default function DocumentRenameDialog() {
    const {
        item
    } = useContext(DocumentContext);

    const [currentCollection, setCurrentCollection] = useAtom(
        currentCollectionAtom,
      );

    const [name, setName] = useState("");

    return (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit name</DialogTitle>
            <DialogDescription>Edit the name of a document</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={item.name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                onClick={async () => {
                  await UpdateDocumentName(item.id, name);

                  const docIndex = currentCollection.documents.findIndex(
                    (x) => x.id === item.id,
                  );
                  if (docIndex !== -1)
                    setCurrentCollection((prevState) => {
                      prevState.documents[docIndex].name = name;

                      return {
                        ...prevState,
                      };
                    });

                  for (let i = 0; i < currentCollection.folders.length; i++) {
                    const folder = currentCollection.folders[i];

                    const docIndex = folder.documents.findIndex(
                      (x) => x.id === item.id,
                    );
                    if (docIndex === -1) continue;

                    setCurrentCollection((prevState) => {
                      prevState.folders[i].documents[docIndex].name = name;

                      return { ...prevState };
                    });
                    break;
                  }
                }}
              >
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    )
}