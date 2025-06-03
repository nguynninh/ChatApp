'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { handleAPI } from '@/lib/http';
import { ForgotPasswordBody, ForgotPasswordBodyType } from '@/schemaValidations/auth.schema';
import { useRouter } from 'next/navigation';

const ForgotPasswordForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (values: ForgotPasswordBodyType) => {
    setIsLoading(true);
    const api = '/identity/auth/forgot-password';
    try {
      await handleAPI(api, values, 'post');

      toast.success('Please check your email to reset your password');

      router.push('/reset-password');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to reset password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleForgotPassword)} 
        className="space-y-4">
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
          {isLoading ? 'Sending...' : 'Send Reset Password Email'}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
