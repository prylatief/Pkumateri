'use server'

import { createClientServer } from '@/lib/supabase'
import { Subject } from '@/types/subject'
import { revalidatePath } from 'next/cache'

// Get all subjects
export async function getSubjects(): Promise<Subject[]> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error)
    return []
  }
  return data || []
}

// Get subject by slug
export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`Error fetching subject by slug ${slug}:`, error)
    return null
  }
  return data
}

// Create subject
export async function createSubject(name: string, slug: string, description: string) {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('subjects')
    .insert([{ name, slug, description }])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/')
  return data
}

// Update subject
export async function updateSubject(id: string, name: string, slug: string, description: string) {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('subjects')
    .update({ name, slug, description })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath(`/subjects/${slug}`)
  revalidatePath('/')
  return data
}

// Delete subject
export async function deleteSubject(id: string) {
  const supabase = await createClientServer()
  const { error } = await supabase.from('subjects').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/')
}
