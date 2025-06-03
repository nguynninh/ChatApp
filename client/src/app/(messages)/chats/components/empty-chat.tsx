import React from 'react'

const EmptyChat = () => {
  return <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-muted-foreground mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM12 2a10 10 0 110 20A10 10 0 0112 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
    <h2 className="text-2xl font-semibold mb-4">Select a chat to start messaging</h2>
    <p className="text-muted-foreground mb-6">
      Click on a chat from the sidebar to view messages and start a conversation.
    </p>
  </div>
}

export default EmptyChat