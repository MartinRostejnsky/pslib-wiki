import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CollectionContent } from "@/lib/types";

export const selectedCollectionAtom = atomWithStorage("currentCollection", "");
export const currentCollectionAtom = atom({
  id: "",
  name: "",
  folders: [],
  documents: [],
  createdAt: Date.prototype,
} as CollectionContent);

export const collectionsAtom = atom([] as CollectionContent[]);
