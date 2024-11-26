import React, { useEffect } from 'react';
import {createAdmin} from "../../src/CreateAdmin"

const SuperAdmin = () => {
    useEffect(() => {
        createAdmin()
      }, []);
  return (
    <div></div>
  )
}

export default SuperAdmin