'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Please enter a password'),
})

type LoginErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>> & {
  submit?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = loginSchema.safeParse(formData)
      if (!validatedData.success) {
        setErrors({ submit: 'Invalid email or password' })
        return
      }
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.data.email,
        password: validatedData.data.password,
      })

      if (error) {
        setErrors({ submit: error.message })
      } else {
        router.push('/')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach(issue => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email: <span className="text-red-500">*</span></label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">Password: <span className="text-red-500">*</span></label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">{errors.password}</span>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
            <Link
              href="/signup"
              className="flex-1 text-center bg-green-500 text-white rounded py-2 px-4 hover:bg-green-600 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}