import React from 'react'
import LoginPage from '@/app/(auth)/login/page'

const page = () => {
  return 1 < 0 ? <LoginPage /> : <div>Redirecting...</div>
}

export default page