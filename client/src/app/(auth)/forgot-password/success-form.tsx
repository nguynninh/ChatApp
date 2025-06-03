'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SuccessForm = () => {
  return (
    <div className="space-y-6 p-2">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-semibold text-center">Password Reset Successful</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Link href="/login">
          <Button className="w-full mt-4">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessForm;
