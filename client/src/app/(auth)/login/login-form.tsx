'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { Button } from '@/components/ui/button';
import { handleAPI } from '@/lib/http';

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRemember, setIsRemember] = useState(false);

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleLogin = async (values: LoginBodyType) => {
        setIsLoading(true);
        try {
            const response = await handleAPI('/identity/auth/login', values, 'post');
            console.log('Login response:', response);
            
            toast.success(response.message);
        } catch (error) {
            console.log((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={isRemember}
                        onCheckedChange={(checked) => setIsRemember(checked === true)}
                    />
                    <label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground cursor-pointer">
                        Remember for 30 days
                    </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    </Form>
}

export default LoginForm;