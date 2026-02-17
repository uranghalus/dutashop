'use client'

import { LoginSchema } from '@/schema/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import z from 'zod'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

import Link from 'next/link'
import { PasswordInput } from './password-input'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction } from '@/action/auth-action'

import { RiLoader4Line, RiErrorWarningLine, RiShoppingBasketLine, RiShoppingBasket2Line } from '@remixicon/react'
import { FieldDescription } from './ui/field'

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    useEffect(() => {
        clearErrors('root')
    }, [watch('email'), watch('password')])

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setIsLoading(true)

        try {
            const res = await loginAction(values)

            if (res.status === 'error') {
                if (res.fieldErrors?.email) {
                    setError('email', {
                        type: 'server',
                        message: res.fieldErrors.email,
                    })
                }

                if (res.fieldErrors?.password) {
                    setError('password', {
                        type: 'server',
                        message: res.fieldErrors.password,
                    })
                }

                if (res.message) {
                    setError('root', {
                        type: 'server',
                        message: res.message,
                    })
                }

                return
            }

            toast.success('Berhasil login', {
                description: res.message,
            })

            router.push(redirect ?? '/dashboard')
        } catch {
            setError('root', {
                type: 'server',
                message: 'Terjadi kesalahan server',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 sm:px-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                >
                    <div className="flex size-8 items-center justify-center rounded-md">
                        <RiShoppingBasket2Line className="size-6" />
                    </div>
                    <span className="sr-only">E-Shop</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to E-Shop.</h1>
            </div>
            {/* Root Error */}
            {errors.root?.message && (
                <Alert variant="destructive">
                    <RiErrorWarningLine className="h-4 w-4" />
                    <AlertTitle>Oops, login gagal</AlertTitle>
                    <AlertDescription>
                        {errors.root.message}
                    </AlertDescription>
                </Alert>
            )}

            {/* Email */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                        />
                    )}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1">
                <div className="flex items-center">
                    <label className="text-sm font-medium">Password</label>
                    <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div>

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <PasswordInput
                            autoComplete="current-password"
                            placeholder="Password"
                            {...field}
                        />
                    )}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
                <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <label className="text-sm font-medium">Remember me</label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                    <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
            </Button>
        </form>
    )
}
