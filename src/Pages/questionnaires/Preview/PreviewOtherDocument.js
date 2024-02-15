import React, { useRef } from 'react'
import { privateAxios } from '../../../api/axios'
import { DOWNLOAD_OTHER_DOCS } from '../../../api/Url'
import { useNavigate } from 'react-router-dom'
import useCallbackState from '../../../utils/useCallBackState'
import Toaster from '../../../components/Toaster'
import { catchError } from '../../../utils/CatchError'

function PreviewOtherDocument({key,documentObj={},doc={},sectionUUID='',questionnaireId=''}) {
    console.log('qid',questionnaireId)
    console.log('documentObj',documentObj)
    const navigate = useNavigate();
    const [otherDocsToasterDetails, setOtherDocsToasterDetails] = useCallbackState({
      titleMessage: "",
      descriptionMessage: "",
      messageType: "error",
    });
    const otherDocToasterRef=useRef()
const downloadOtherDocument=async()=>{
    try {
        const response = await privateAxios.post(DOWNLOAD_OTHER_DOCS,{
            questionnaireId:questionnaireId,
            sectionId:sectionUUID,
            documentId:documentObj?.uuid??doc.uuid
        },{
            responseType:'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement(`a`);
        link.href = url;
        link.setAttribute(`download`, `${documentObj?.originalName??doc.originalName}`);
        document.body.appendChild(link);
        link.click();
        if (response.status===201) {
            setOtherDocsToasterDetails(
                {
                  titleMessage: "Hurray!",
                  descriptionMessage: 'File downloaded successfully!',
                  messageType: "success",
                },
                () => otherDocToasterRef.current()
              )
        }

    } catch (error) {
        catchError(error,setOtherDocsToasterDetails,otherDocToasterRef,navigate)
        console.log("Error from download other doc",error)        
    }
}
  return (
    <div className="preview-que-blk">
         <Toaster
        myRef={otherDocToasterRef}
        titleMessage={otherDocsToasterDetails.titleMessage}
        descriptionMessage={otherDocsToasterDetails.descriptionMessage}
        messageType={otherDocsToasterDetails.messageType}
      />
    <div className="form-group">
        <label htmlFor="questionTitle">
            <div className="preview-sect-txt">
          Document title -   {documentObj?.documentTitle??doc?.documentTitle}
              
            </div>
        </label>
        <div className="que-half-sect"  href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                downloadOtherDocument()
                                            }}
                                            style={{ color:  "#4596D1",cursor:"pointer"}} >
            {documentObj?.originalName??doc.originalName}
        </div>
    </div>
</div>
  )
}

export default PreviewOtherDocument