import React, { useRef } from 'react'
import { privateAxios } from '../../../api/axios'
import { DOWNLOAD_OTHER_DOCS } from '../../../api/Url'
import { useNavigate } from 'react-router-dom'
import useCallbackState from '../../../utils/useCallBackState'
import Toaster from '../../../components/Toaster'
import { catchError } from '../../../utils/CatchError'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function PreviewOtherDocument({key,documentObj={},doc={},sectionUUID='',questionnaireId=''}) {
    console.log('qid',questionnaireId)
    console.log('documentObj',documentObj)
    console.log('doc',doc)
    console.log('LINK ',documentObj?.link)
    let link=()=>{
      if (documentObj?.link) {
        return documentObj?.link
      } else {
        return doc?.link
        
      }
    }
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
    <div >
         <Toaster
        myRef={otherDocToasterRef}
        titleMessage={otherDocsToasterDetails.titleMessage}
        descriptionMessage={otherDocsToasterDetails.descriptionMessage}
        messageType={otherDocsToasterDetails.messageType}
      />
    {/* <div >
        <label htmlFor="questionTitle">
            <div >
          Document title -   {documentObj?.documentTitle??doc?.documentTitle}
              
            </div>
        </label>
        <div  href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                downloadOtherDocument()
                                            }}
                                            style={{ color:  "#4596D1",cursor:"pointer"}} >
            {documentObj?.originalName??doc.originalName}
        </div>
    </div> */}
     <TableContainer component={Paper} className='table-blk'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {/* <TableHead>
          <TableRow>
        
            <TableCell align='center' >Title</TableCell>
            <TableCell align='center'>File/Link</TableCell>
        
          </TableRow>
        </TableHead> */}
        <TableBody>
          
            <TableRow
              // key={}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            
              <TableCell align='center' width={'50%'}>{documentObj?.documentTitle??documentObj?.linkTitle??doc?.documentTitle??doc?.linkTitle}</TableCell>
           
              <TableCell align='left' width={'50%'}>{
                doc?.type==='Link'||documentObj?.type==='Link'?
                
                <a href={"http://"+link()} onClick={()=>console.log('LINK ON ONCLICK',"http://"+doc?.link??documentObj?.link)}target='_blank' >{doc?.link??documentObj?.link}</a>:
                  <div  href="#"
                  onClick={(e) => {
                      e.preventDefault();

                      downloadOtherDocument()
                  }}
                  style={{ color:doc?.link?'none':  "#4596D1",cursor:doc?.link?'default':"pointer"}} >
{documentObj?.originalName??doc.originalName??doc?.link}
</div>}</TableCell>
            </TableRow>
        
        </TableBody>
      </Table>
    </TableContainer>
</div>
  )
}

export default PreviewOtherDocument