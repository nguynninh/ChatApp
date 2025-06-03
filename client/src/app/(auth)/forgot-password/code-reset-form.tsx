'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { handleAPI } from '@/lib/http';
import { ForgotPasswordBody, ForgotPasswordBodyType, ResetPasswordBody, ResetPasswordBodyType } from '@/schemaValidations/auth.schema';
import { Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"


interface CodeResetFormProps {
    form: ReturnType<typeof useForm<ResetPasswordBodyType>>;
    setStep: (step: string) => void;
}

const CodeResetForm = (props: CodeResetFormProps) => {
    const { form, setStep } = props;

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Form {...form}>
            <form className="space-y-4">
                <div className="text-center">
                    <Mail className="mx-auto mb-4" size={36} />
                    <p className="text-sm text-muted-foreground">
                        We sent a code to <span className="font-medium">{form.watch("email")}</span>.
                    </p>
                </div>
        
                <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputOTP
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
            </form>
        </Form>
    );
};

export default CodeResetForm;