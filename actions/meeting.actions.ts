'use server'

import { createClientServer } from '@/lib/supabase'
import { Meeting } from '@/types/meeting'
import { revalidatePath } from 'next/cache'

// Get all meetings (with subject join)
export async function getMeetings(): Promise<Meeting[]> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('meetings')
    .select('*, subjects(id, name, slug)')
    .order('meeting_number', { ascending: true })

  if (error) {
    console.error('Error fetching meetings:', error)
    return []
  }
  return data as unknown as Meeting[] || []
}

// Get meetings by subject id
export async function getMeetingsBySubjectId(subjectId: string): Promise<Meeting[]> {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('subject_id', subjectId)
    .order('meeting_number', { ascending: true })

  if (error) {
    console.error(`Error fetching meetings for subject ${subjectId}:`, error)
    return []
  }
  return data || []
}

// Create meeting
export async function createMeeting(subjectId: string, title: string, meetingNumber: number) {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('meetings')
    .insert([{ subject_id: subjectId, title, meeting_number: meetingNumber }])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/')
  return data
}

// Update meeting
export async function updateMeeting(id: string, subjectId: string, title: string, meetingNumber: number) {
  const supabase = await createClientServer()
  const { data, error } = await supabase
    .from('meetings')
    .update({ subject_id: subjectId, title, meeting_number: meetingNumber })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/')
  return data
}

// Delete meeting
export async function deleteMeeting(id: string) {
  const supabase = await createClientServer()
  const { error } = await supabase.from('meetings').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/subjects')
  revalidatePath('/')
}
