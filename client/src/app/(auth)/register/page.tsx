import RegisterForm from '@/app/(auth)/register/register-form';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardFooter, 
    CardHeader, 
    CardTitle, 
    CardDescription
} from '@/components/ui/card';

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[480px] shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Free trial 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already an acount?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
  )
}

export default RegisterPage