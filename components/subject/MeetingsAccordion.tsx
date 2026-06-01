'use client'

import { useState } from 'react'
import { Meeting } from '@/types/meeting'
import { Material } from '@/types/material'
import MaterialList from '@/components/material/MaterialList'
import { Calendar, FileText, ChevronDown } from 'lucide-react'

interface MeetingsAccordionProps {
  meetings: Meeting[]
  materialsByMeeting: Record<string, Material[]>
}

export default function MeetingsAccordion({ meetings, materialsByMeeting }: MeetingsAccordionProps) {
  const [openMeetingId, setOpenMeetingId] = useState<string | null>(
    meetings.length > 0 ? meetings[0].id : null
  )

  const toggleMeeting = (id: string) => {
    setOpenMeetingId(openMeetingId === id ? null : id)
  }

  return (
    <div className="w-full space-y-3">
      {meetings.map((meeting) => {
        const materials = materialsByMeeting[meeting.id] || []
        const isOpen = openMeetingId === meeting.id

        return (
          <div
            key={meeting.id}
            className="bg-card/20 border border-border/30 rounded-2xl overflow-hidden hover:bg-card/30 transition-colors"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleMeeting(meeting.id)}
              className="w-full text-left py-4 px-5 text-base font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between outline-none"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10">
                  <span className="font-bold text-sm">{meeting.meeting_number}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-0.5">
                    Pertemuan {meeting.meeting_number}
                  </span>
                  <span className="leading-tight">{meeting.title}</span>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                  isOpen ? 'transform rotate-180 text-primary' : ''
                }`}
              />
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-5 pb-5 pt-3 border-t border-border/10 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Pertemuan Terjadwal
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    {materials.length} File Materi
                  </span>
                </div>
                <MaterialList materials={materials} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
