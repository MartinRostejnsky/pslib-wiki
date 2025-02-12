import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Collection } from "@/lib/types";

export const selectedCollectionAtom = atomWithStorage("currentCollection", "");
export const collectionsAtom = atom([] as Collection[]);
