import React from 'react'
import { privateAxios } from '../../../api/axios'
import { DOWNLOAD_OTHER_DOCS } from '../../../api/Url'

function PreviewOtherDocument({key,documentObj={},doc={},sectionUUID='',questionnaireId=''}) {
    console.log('qid',questionnaireId)
    console.log('documentObj',documentObj)
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
    } catch (error) {
        console.log("Error from download other doc",error)        
    }
}
  return (
    <div className="preview-que-blk">
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
                                            style={{ color: questionnaireId.length>0? "#4596D1":"none" }} >
            {documentObj?.originalName??doc.originalName}
        </div>
    </div>
</div>
  )
}

export default PreviewOtherDocument