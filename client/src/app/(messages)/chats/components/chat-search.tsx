'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronLeft, SearchIcon, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatSearchProps {
    onSearch: (query: string) => void;
}

const ChatSearch = (props: ChatSearchProps) => {
    const { onSearch } = props;

    const [isClicked, setIsClicked] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);

        console.log('Search query:', query);
    };

    return <div className='flex items-center justify-between'>
        {isClicked && <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsClicked(!isClicked)}
            title="Search conversations">
            <ChevronLeft className="h-10 w-10" />
        </Button>}
        <div className="relative flex-1">
            <SearchIcon
                className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                onClick={() => setIsClicked(true)}
            />

            <Input
                placeholder="Search conversations..."
                className="pl-8 border-primary/20"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsClicked(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsClicked(false);
                    }
                }}
            />
        </div>
        {isClicked && <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsClicked(!isClicked)}
            title="Search conversations">
            <SendHorizontal className="h-10 w-10" />
        </Button>}
    </div>;
}

export default ChatSearch