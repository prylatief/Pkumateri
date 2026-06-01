'use server'

import { createClientServer } from '@/lib/supabase'
import { Material } from '@/types/material'
import { getDriveThumbnailUrl } from '@/lib/drive'
import { revalidatePath } from 'next/cache'

// Get all materials (with meeting join)
export async function getMaterials(): Promise<Material[]> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('materials')
    .select('*, meetings(*, subjects(*))')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching materials:', error)
    return []
  }
  return data as unknown as Material[] || []
}

export async function getMaterialById(id: string): Promise<Material | null> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('materials')
    .select('*, meetings(*, subjects(*))')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching material ${id}:`, error)
    return null
  }
  return data as unknown as Material
}

// Get materials by meeting id
export async function getMaterialsByMeetingId(meetingId: string): Promise<Material[]> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error(`Error fetching materials for meeting ${meetingId}:`, error)
    return []
  }
  return data || []
}

// Search materials
export async function searchMaterials(query: string): Promise<Material[]> {
  if (!query || query.trim() === '') {
    return getMaterials()
  }

  const supabase = await createClientServer()
  const searchPattern = `%${query}%`

  // Direct keyword text search across material title or description
  const { data, error } = await supabase
    .from('materials')
    .select('*, meetings(*, subjects(*))')
    .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error searching materials for query ${query}:`, error)
    return []
  }

  return data as unknown as Material[] || []
}

// Create material
export async function createMaterial(meetingId: string, title: string, description: string, driveUrl: string, fileType = 'pdf') {
  const supabase = await createClientServer()
  const thumbnail = getDriveThumbnailUrl(driveUrl)

  const { data, error } = await supabase
    .from('materials')
    .insert([{ 
      meeting_id: meetingId, 
      title, 
      description, 
      drive_url: driveUrl, 
      file_type: fileType,
      thumbnail
    }])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/search')
  revalidatePath('/')
  return data
}

// Update material
export async function updateMaterial(id: string, meetingId: string, title: string, description: string, driveUrl: string, fileType = 'pdf') {
  const supabase = await createClientServer()
  const thumbnail = getDriveThumbnailUrl(driveUrl)

  const { data, error } = await supabase
    .from('materials')
    .update({ 
      meeting_id: meetingId, 
      title, 
      description, 
      drive_url: driveUrl, 
      file_type: fileType,
      thumbnail
    })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/search')
  revalidatePath('/')
  return data
}

// Delete material
export async function deleteMaterial(id: string) {
  const supabase = await createClientServer()
  const { error } = await supabase.from('materials').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/search')
  revalidatePath('/')
}
