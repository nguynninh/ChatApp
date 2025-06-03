export const getTopicByLink = (topic: string) => {
    topic = topic.trim().toLowerCase();

    const links: Record<string, string> = {
        'love': "https://res.cloudinary.com/ddox3txnn/image/upload/v1748487584/futari/theme-chat/love.jpg",
        'default': "",
    }

    return links[topic] || links['default'];
}