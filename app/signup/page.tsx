'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { SiDiscord } from "react-icons/si"
import { LockIcon, MailIcon } from 'lucide-react'
const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^a-zA-Z0-9]/, 'Must include a symbol'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  discordHandle: z.string().optional(),
})

type SignupErrors = Partial<Record<keyof z.infer<typeof signupSchema>, string | string[]>> & {
  submit?: string
}



export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    discordHandle: '',
  })
  const [errors, setErrors] = useState<SignupErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof SignupErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = signupSchema.parse(formData)
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            first_name: validatedData.firstName || null,
            last_name: validatedData.lastName || null,
            discord_handle: validatedData.discordHandle || null,
          }
        }
      })

      if (error) {
        setErrors({ submit: error.message })
      } else {
        router.push('/')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string | string[]> = {}
        
        // Group password errors to show all requirements
        const passwordErrors: string[] = []
        
        error.issues.forEach(issue => {
          if (issue.path[0] === 'password') {
            passwordErrors.push(issue.message)
          } else if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        
        if (passwordErrors.length > 0) {
          fieldErrors.password = passwordErrors
        }
        
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium flex gap-1 items-center"><MailIcon className="size-4" />Email: <span className="text-red-500">*</span></label>
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
            <label htmlFor="password" className="mb-1 font-medium flex gap-1 items-center"><LockIcon className="size-4" /> Password: <span className="text-red-500">*</span></label>
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
            <div className="text-xs text-gray-500 mt-1">
              Must be at least 12 characters with uppercase, number, and symbol
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.password) ? (
                  <ul className="list-disc list-inside">
                    {(errors.password as string[]).map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{errors.password}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="firstName" className="mb-1 font-medium">First Name:</label>
              <input 
                id="firstName" 
                name="firstName" 
                type="text" 
                value={formData.firstName}
                onChange={handleInputChange}
                className="rounded border p-2 dark:bg-gray-700 dark:border-gray-600" 
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="lastName" className="mb-1 font-medium">Last Name:</label>
              <input 
                id="lastName" 
                name="lastName" 
                type="text" 
                value={formData.lastName}
                onChange={handleInputChange}
                className="rounded border p-2 dark:bg-gray-700 dark:border-gray-600" 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="discordHandle" className="mb-1 font-medium flex gap-1 items-center"><SiDiscord className="pt-0.5" /> Discord Handle:</label>
            <input 
              id="discordHandle" 
              name="discordHandle" 
              type="text" 
              value={formData.discordHandle}
              onChange={handleInputChange}
              placeholder="@username"
              className="rounded border p-2 dark:bg-gray-700 dark:border-gray-600" 
            />
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}
          
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-green-500 text-white rounded py-2 px-4 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
            <Link
              href="/login"
              className="flex-1 text-center bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
