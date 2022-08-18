import React from 'react'
import { Link,useLocation } from 'react-router-dom'

const SubAdminList = () => {
    const location = useLocation()
    console.log("location",location)
  return (
    <div>SubAdminList
    <Link to={'/sub-admins/add-sub-admin'}>Add sub admin</Link>
    </div>
  )
}

export default SubAdminList