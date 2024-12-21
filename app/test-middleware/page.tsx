import React from 'react'
import {auth} from '@/auth';

const TestMiddleware = async () => {

    const session = await auth();
  return (
    <div>
      <p>This is a test for middleware</p>
      {session?.user?.email ? (
        <p>User Email: {session.user.email}</p>
      ) : (
        <p>No user email found</p>
      )}
    </div>
  )
}

export default TestMiddleware
