import z from 'zod'

export const RegisterBody = z
  .object({
    firstName: z.string().trim().min(2).max(256),
    lastName: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string()
    })
  }),
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = RegisterRes

export type LoginResType = z.TypeOf<typeof LoginRes>
export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = RegisterRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>

// Forgot Password schema
export const ForgotPasswordBody = z
  .object({
    email: z.string().email('Invalid email address'),
  })
  .strict()

export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>

export const ForgotPasswordRes = z.object({
  message: z.string()
})

export type ForgotPasswordResType = z.TypeOf<typeof ForgotPasswordRes>

// Reset Password schema
export const ResetPasswordBody = z
  .object({
    email: z.string().email('Invalid email address'),
    token: z.string().min(6, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters').max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
      })
    }
  })

export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>

export const ResetPasswordRes = z.object({
  message: z.string()
})

export type ResetPasswordResType = z.TypeOf<typeof ResetPasswordRes>