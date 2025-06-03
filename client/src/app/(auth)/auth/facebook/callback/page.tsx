'use client'

import { handleAPI } from '@/lib/http'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function FacebookCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            toast.error(`Google login error: ${error}`)
            return
        }

        if (!code) {
            toast.error('No authorization code found in URL.')
            return
        }

        const fetchToken = async () => {
            setIsLoading(true)
            const api = '/identity/auth/facebook/callback?code=' + code
            try {
                const res = await handleAPI(
                    api,
                    {},
                    'post'
                )

                console.log('Facebook login response:', res)

                toast.success('Facebook login successful! Redirecting...')

                router.push('/')
            } catch (err) {
                toast.error((err as Error).message || 'Failed to process Google login. Please try again later.')
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }

        fetchToken()
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Facebook Authentication</h1>
            {isLoading && <p>Processing your login...</p>}
        </div>
    )
}