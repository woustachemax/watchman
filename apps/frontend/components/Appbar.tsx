"use client"

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
// import useRouter from 'next/navigation'

export const AppBar = ()=>{
  // const router = useRouter();

    return <div className='flex justify-between items-center p-4 mx-3'>
        <div className='font-extrabold'> Watchman </div>
        <div className='flex'>
        <SignedOut>
            <div className='mx-2 font-extrabold'>
              <SignInButton />
            </div>
            <div className='mx-2 font-extrabold'>
            <SignUpButton />
            </div>
        </SignedOut>
        <SignedIn>
              <UserButton />
        </SignedIn>
        </div>

    </div>
}