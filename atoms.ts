import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Collection, CollectionContent } from "@/lib/types";

export const selectedCollectionAtom = atomWithStorage("currentCollection", "");
export const collectionsAtom = atom([] as Collection[]);

export const collectionContentsAtom = atom([] as CollectionContent[]);
