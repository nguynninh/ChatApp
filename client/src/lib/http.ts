export class HttpError extends Error {
    status: number = 500;
    payload?: any;
  
  constructor(status: number, message?: string, payload?: any) {
    super(message);

    this.status = status;
    this.payload = payload;
  }
}

export const handleAPI = async (
    url: string, 
    data?: any, 
    methods?: 'post' | 'put' | 'get' | 'delete'
) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.101:8888/api/v1';

    try {
        const res = await fetch(`${baseUrl}${url}`, {
            method: methods?.toUpperCase() || 'GET',
            headers,
            body: data ? JSON.stringify(data) : undefined,
            credentials: 'include',
        });

        if (res.status >= 400) {
            const errorData = await res.json();
            throw new HttpError(res.status, errorData.message, errorData);
        }

        return res.json();
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw new HttpError(500, 'An unexpected error occurred', error);
        }
    }
};