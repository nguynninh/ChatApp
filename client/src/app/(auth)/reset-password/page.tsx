import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ResetPasswordForm from './reset-password-form'

const ResetPassword = () => {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription> 
            No worries, we{"'"}ll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            <ArrowLeft className="inline mr-1 w-4 h-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResetPassword