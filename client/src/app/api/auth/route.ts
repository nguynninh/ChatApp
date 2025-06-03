export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.data.token;

    if (!sessionToken) {
        return Response.json({
            code: 400,
            message: "Session token is required",
        }, { status: 400 });
    }

    return Response.json({
        status: 200,
        message: "Authenticated successfully",
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
    }, { status: 200 });
}
        