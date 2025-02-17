import { PropsWithChildren, useMemo, useState } from "react";
import { DocumentContext } from "./DocumentContext";

interface DocumentContextProviderProps {
    item: { id: string; name: string };
    folders: { id: string; name: string }[];
}

const DocumentContextProvider : React.FC<PropsWithChildren<DocumentContextProviderProps>> = (props) => {

    return (
        <DocumentContext.Provider value={{
            item: props.item,
            folders: props.folders,
        }}>
            {props.children}
        </DocumentContext.Provider>
    );
}

export default DocumentContextProvider;