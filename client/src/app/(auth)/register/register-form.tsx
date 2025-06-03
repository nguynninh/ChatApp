'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema';
import { Button } from '@/components/ui/button';
import { handleAPI } from '@/lib/http';

const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleRegister = async (values: RegisterBodyType) => {
        setIsLoading(true);
        try {
            const response = await handleAPI('/identity/users/registration', values, 'post');
            
            toast.success('Đăng ký thành công!');
            
            console.log('Registration successful:', response);
            router.push('/');
        } catch (error: unknown) {
            console.error('Registration error:', error);
            toast.error((error as Error).message || 'Registration failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
            <div className="flex gap-4">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                    <Input
                        placeholder="First name"
                        maxLength={50}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                    <Input
                        placeholder="Last name"
                        maxLength={50}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter your email"
                    type="email"
                    maxLength={100}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter your password"
                    type="password"
                    maxLength={100}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Confirm your password"
                    type="password"
                    maxLength={100}
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button
            type="submit"
            className="w-full mt-6"
            disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    </Form>
}

export default RegisterForm