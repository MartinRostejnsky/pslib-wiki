import { createContext } from "react";
import { DocumentContextType } from "./DocumentContextTypes";

const defaultDocumentContext = {} as DocumentContextType;

export const DocumentContext = createContext(defaultDocumentContext);