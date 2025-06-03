'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { handleAPI } from '@/lib/http';
import { ResetPasswordBodyType } from '@/schemaValidations/auth.schema';
import { Fingerprint } from 'lucide-react';

interface ResetPasswordFormProps {
    form: ReturnType<typeof useForm<ResetPasswordBodyType>>;
    setStep: (step: string) => void;
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { form, setStep } = props;
    const [isLoading, setIsLoading] = useState(false);


    const handleResetPassword = async (values: ResetPasswordBodyType) => {
        setIsLoading(true);
        const api = '/identity/auth/reset-password';
        try {
            await handleAPI(api, values, 'post');

            toast.success('Password reset successfully');

            setStep('success');
        } catch (error) {
            toast.error((error as Error).message || 'Failed to reset password. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetPassword)}
                className="space-y-4">
                <div className="text-center">
                    <Fingerprint className="mx-auto mb-4" size={36} />
                    <h2 className="text-2xl font-semibold text-center">Forgot password?</h2>
                    <p className="text-sm text-muted-foreground">
                        No worries, we{"'"}ll send you reset instructions.
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className='mt-2'>
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

                <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send reset password email'}
                </Button>
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
