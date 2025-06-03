'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ResetPasswordBody, ResetPasswordBodyType } from '@/schemaValidations/auth.schema';
import { Button } from '@/components/ui/button';
import { handleAPI } from '@/lib/http';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      email: '',
      token: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleResetPassword = async (values: ResetPasswordBodyType) => {
    setIsLoading(true);
    try {
      const response = await handleAPI('/identity/auth/reset-password', values, 'post');
      console.log('Reset password response:', response);

      toast.success(response.message);
      router.push('/login');
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(handleResetPassword)}
      className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="relative">
            <FormControl>
              <Input
                placeholder="Enter your email"
                type="email"
                maxLength={100}
                {...field}
              />
            </FormControl>
            <button
              type="button"Coe
              className="absolute right-0 top-1/2 -translate-y-1/2 mr-3"
              onClick={() => field.onChange('')}>
              otp
            </button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>OTP</FormLabel>
            <FormControl>
              <Input
                placeholder="OTP code"
                type="text"
                inputMode="numeric"
                maxLength={100}
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
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
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  maxLength={100}
                  {...field}
                />
              </FormControl>
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-3"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible
                  ? <Eye className="h-5 w-5"/>
                  : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
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
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="Enter your confirm password"
                  type="password"
                  maxLength={100}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-3"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                {isConfirmPasswordVisible
                  ? <Eye className="h-5 w-5" />
                  : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  </Form>;
}

export default ResetPasswordForm;