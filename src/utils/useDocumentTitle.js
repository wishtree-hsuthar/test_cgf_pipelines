import { useEffect } from "react";
export const useDocumentTitle = (title) => {

    useEffect(() => {
        document.title = `HRDD System - ${title}`;
    }, [title]);

    return null;
}