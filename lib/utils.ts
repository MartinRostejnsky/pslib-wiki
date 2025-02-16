import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RecordId } from "surrealdb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToRecordId(input: string): RecordId {
  const inputSplit = input.split(":");
  return new RecordId(inputSplit[0], inputSplit[1]);
}
