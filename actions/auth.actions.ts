'use server'

import { createClientServer } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Get current user session
export async function getCurrentUser() {
  const supabase = await createClientServer()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    return null
  }
  return user
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = await createClientServer()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return data
}

// Sign out
export async function signOut() {
  const supabase = await createClientServer()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  revalidatePath('/admin')
}
