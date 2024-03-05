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
import { Tooltip } from '@mui/material'

function PreviewOtherDocument({ key, documentObj = {}, doc = {}, sectionUUID = '', questionnaireId = '' }) {
  console.log('qid', questionnaireId)
  console.log('documentObj', documentObj)
  console.log('doc', doc)
  console.log('LINK ', documentObj?.link)

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength - 3) + '...';
    }
  }

  let link = () => {
    if (documentObj?.link) {
      if (documentObj?.link.toLowerCase().startsWith("http")) {
        return documentObj?.link
      } else {
        return 'https://' + documentObj?.link
      }


    } else {
      if (doc?.link.toLowerCase().startsWith("https")) {
        return doc?.link
      } else {
        return 'https://' + doc?.link
      }

    }
  }
  const navigate = useNavigate();
  const [otherDocsToasterDetails, setOtherDocsToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const otherDocToasterRef = useRef()
  const downloadOtherDocument = async () => {

    try {
      const response = await privateAxios.post(DOWNLOAD_OTHER_DOCS, {
        questionnaireId: questionnaireId,
        sectionId: sectionUUID,
        documentId: documentObj?.uuid ?? doc.uuid
      }, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement(`a`);
      link.href = url;
      link.setAttribute(`download`, `${documentObj?.originalName ?? doc.originalName}`);
      document.body.appendChild(link);
      link.click();
      if (response.status === 201) {
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
      catchError(error, setOtherDocsToasterDetails, otherDocToasterRef, navigate)
      console.log("Error from download other doc", error)
    }
  }
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(doc?.link || documentObj?.link);
      setOtherDocsToasterDetails(
        {
          titleMessage: "Hurray!",
          descriptionMessage: 'Link copied successfully!',
          messageType: "success",
        },
        () => otherDocToasterRef.current()
      )
    } catch (error) {
      console.error('Failed to copy link: ', error);
    }
  };

  return (
    <div >
      <Toaster
        myRef={otherDocToasterRef}
        titleMessage={otherDocsToasterDetails.titleMessage}
        descriptionMessage={otherDocsToasterDetails.descriptionMessage}
        messageType={otherDocsToasterDetails.messageType}
      />

      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>

            <TableRow

            >

              <TableCell align='left' style={{ width: '50%' }}>{documentObj?.documentTitle ?? documentObj?.linkTitle ?? doc?.documentTitle ?? doc?.linkTitle}</TableCell>

              <TableCell align='left'  >{
                doc?.type === 'Link' || documentObj?.type === 'Link' ?
                  <>
                  <a href={link()} onClick={() => console.log('LINK ON ONCLICK', "https://" + doc?.link ?? documentObj?.link)} target='_blank' >
                    <Tooltip title={documentObj?.link ?? doc.link ?? doc?.link}>
                    
                    {truncateText(doc?.link ?? documentObj?.link,70)}
                    </Tooltip>
                    
                    </a> 
                    <button onClick={copyToClipboard}>Copy Link</button>
                    </>
                    :
                  <div href="#"
                    onClick={(e) => {
                      e.preventDefault();

                      downloadOtherDocument()
                    }}
                    style={{ color: doc?.link ? 'none' : "#4596D1", cursor: doc?.link ? 'default' : "pointer" }} >

                    <Tooltip title={documentObj?.originalName ?? doc.originalName ?? doc?.link}>
                      {truncateText(documentObj?.originalName ?? doc.originalName ?? doc?.link, 70)}
                    </Tooltip>
                  </div>
                  }</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PreviewOtherDocument