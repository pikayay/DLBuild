import SignUpForm from '@/app/components/SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Sign Up
        </h1>
        <div className="w-full max-w-xs">
          <SignUpForm />
          <p className="mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
