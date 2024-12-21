import React from 'react'
import {auth} from '@/auth';
import { redirect } from 'next/navigation';

const TestServer = async () => {


    const session = await auth();

    if(!session){
        redirect("/");
    }
  return (
    <div>
      <p>This is a test for TestServer</p>
      {session?.user?.email ? (
        <p>User Email: {session.user.email}</p>
      ) : (
        <p>No user email found</p>
      )}
    </div>
  )
}

export default TestServer;
