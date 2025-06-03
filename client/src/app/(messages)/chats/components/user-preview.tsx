'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import UserProfileModal from '@/modals/UserProfileModal'
import { User } from '@/models/UserModel'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { set } from 'zod'

interface UserPreviewProps {
    userId: string,
}

const UserPreview = (props: UserPreviewProps) => {
    const { userId } = props

    const [isLoading, setIsLoading] = useState(false)

    const [user, setUser] = useState<User>({
        id: userId,
        name: "John Doe",
        photoUrl: "https://via.placeholder.com/150",
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    useEffect(() => {
        const handleGetUser = async (id: string) => {
            const api = "/identity/users/" + id
            setIsLoading(true)

            try {
                
            } catch (error) {
                toast.error((error as Error).message || "Failed to fetch user data")
            } finally {
                setIsLoading(false)
            }

        }

        handleGetUser(userId)
    }, [])

    const [isOpenUserProfileModal, setIsOpenUserProfileModal] = useState(false)

    return <div className="flex items-center gap-3">
        <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setIsOpenUserProfileModal(true)}
            title="User Profile">
            <Avatar>
                <AvatarImage
                    src={user.photoUrl}
                    alt={user.name} />
                <AvatarFallback>
                    {user.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
        </Button>
        <div className='flex flex-col'>
            <h2 className="font-semibold">{user.name}</h2>
            <span className="text-sm text-muted-foreground">
                {"Last activity 30 minutes ago"}
            </span>
        </div>
        {isOpenUserProfileModal &&
            <UserProfileModal
                user={user}
                isOpen={isOpenUserProfileModal}
                onClose={() => setIsOpenUserProfileModal(false)} />}
    </div>
}

export default UserPreview