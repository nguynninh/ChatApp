import LoginForm from '@/app/(auth)/login/login-form'
import SocialLogin from '../components/social-login';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardFooter, 
    CardHeader, 
    CardTitle, 
    CardDescription
} from '@/components/ui/card';

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[480px] shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription>Welcome back! Please login to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <SocialLogin />

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage;
