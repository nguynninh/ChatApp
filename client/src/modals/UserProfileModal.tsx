import { AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeChat } from "@/models/ThemeModel";
import { User } from "@/models/UserModel";
import { getTopicByLink } from "@/utils/getTopicByLink";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { DialogDescription } from "@radix-ui/react-dialog";
import { BadgeMinus, Ban, Bell, Bug, CaseSensitive, ChevronRight, CircleEllipsis, Delete, ExternalLink, Eye, Images, Pin, ScanSearch, Sparkles, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { set } from "zod";

interface UserProfileProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal = (props: UserProfileProps) => {
    const { id, name, username, email, phone, photoUrl } = props.user;
    const { isOpen, onClose } = props;

    const [readReceipts, setReadReceipts] = useState(true);
    const [typingIndicators, setTypingIndicators] = useState(true);

    const [custom, setCustom] = useState<ThemeChat>({
        topic: 'love',
        quickReactions: '❤️',
        nicknames: "Báo :(("
    });

    return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="flex flex-col items-center pb-4">
                <Avatar className="flex items-center justify-center">
                    <AvatarImage
                        src={photoUrl}
                        alt={name}
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }}
                    />
                    <AvatarFallback className="flex items-center justify-center bg-primary/10 text-4xl"
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            color: 'var(--shadcn-color-primary-foreground)',
                        }}>
                        {name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <DialogTitle>
                    {custom.nicknames ? custom.nicknames : name || 'User Profile'}
                </DialogTitle>
                <DialogDescription>
                    {username ? `@${username}` : id}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
                <h1 className="text-xl font-semibold mb-3">
                    Custom
                </h1>

                <Card className="w-full space-y-1.5 p-2">
                    <div className="flex items-center space-x-3">
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '100%',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                src={getTopicByLink(custom.topic)}
                                alt="Topic"
                                width={24}
                                height={24} />
                        </div>
                        <span>Theme</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                            {custom.quickReactions}
                        </span>
                        <span>Quick Reactions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CaseSensitive className="w-5 h-5" />
                        <span>Nicknames</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5" />
                        <span>Word Effects</span>
                    </div>
                </Card>
            </div>

            <div className="mt-4">
                <h1 className="text-xl font-semibold mb-3">
                    Other Actions
                </h1>

                <Card className="w-full space-y-1.5 p-2">
                    <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5" />
                        <span>Create group chat with {name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Images className="w-5 h-5" />
                        <span>View media, files, and links</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Pin className="w-5 h-5" />
                        <span>Pinned messages</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ScanSearch className="w-5 h-5" />
                        <span>Search in conversation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5" />
                        <span>Notifications & sounds</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ExternalLink className="w-5 h-5" />
                        <span>Share contact information</span>
                    </div>
                </Card>
            </div>

            <div className="mt-4 mb-2">
                <h1 className="text-xl font-semibold mb-3">
                    Privacy and Support
                </h1>

                <Card className="w-full space-y-1.5 p-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Eye className="w-5 h-5" />
                            <span>Read Receipts</span>
                        </div>
                        <div className="flex items-center space-x-2"
                            onClick={() => {setReadReceipts(!readReceipts)}}>
                            <h4>
                                {readReceipts ? 'On' : 'Off'}
                            </h4>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CircleEllipsis className="w-5 h-5" />
                            <span>Typing Indicators</span>
                        </div>
                        <div className="flex items-center space-x-2"
                            onClick={() => {setTypingIndicators(!typingIndicators)}}>
                            <h4>
                                {typingIndicators ? 'On' : 'Off'}
                            </h4>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Ban className="w-5 h-5" />
                        <span>Restrict</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <BadgeMinus className="w-5 h-5" />
                        <span>Block</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Bug className="w-5 h-5" />
                        <span>Report</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5" />
                        <span>Delete chat</span>
                    </div>
                </Card>
            </div>
        </DialogContent>
    </Dialog>
}

export default UserProfileModal