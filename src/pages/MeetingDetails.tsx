import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { meetingsApi } from '../services/api';
import { Meeting } from '../types/meeting';
import { MeetingHeader } from '../components/meeting/MeetingHeader';
import { MeetingAgenda } from '../components/meeting/MeetingAgenda';
import { AttendanceSection } from '../components/meeting/AttendanceSection';
import { MinutesSection } from '../components/meeting/MinutesSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function MeetingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState<Meeting | null>(null);

  const {
    data: meeting,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => {
      if (!id) throw new Error('ID da reunião não fornecido');
      return meetingsApi.getById(id);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Reunião não encontrada" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Reunião não encontrada" />
      </div>
    );
  }

  // Initialize editedMeeting if not set
  if (!editedMeeting) {
    setEditedMeeting(meeting);
    return null; // Return null to prevent rendering with uninitialized editedMeeting
  }

  const handleSave = async () => {
    if (!editedMeeting) return;
    
    try {
      await meetingsApi.update(meeting.id, editedMeeting);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleAttendanceChange = (attendeeIds: string[]) => {
    if (!editedMeeting) return;

    const presentAttendees = meeting.attendees.filter(a => 
      attendeeIds.includes(a.id)
    );
    
    const attendanceList = presentAttendees
      .map(a => `- ${a.name}`)
      .join('\n');

    const currentMinutes = editedMeeting.minutes?.content || '';
    const attendanceSection = '\n\nLista de Presença:\n' + attendanceList;

    setEditedMeeting({
      ...editedMeeting,
      minutes: {
        ...editedMeeting.minutes || {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        content: currentMinutes.includes('Lista de Presença:')
          ? currentMinutes.replace(/Lista de Presença:[\s\S]*$/, 'Lista de Presença:\n' + attendanceList)
          : currentMinutes + attendanceSection,
      },
    });
  };

  const isTodayMeeting = isToday(parseISO(meeting.date));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <MeetingHeader
        meeting={editedMeeting}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditedMeeting(meeting);
        }}
        onChange={setEditedMeeting}
      />

      <MeetingAgenda
        agendas={editedMeeting.agendas}
        isEditing={isEditing}
        onChange={(agendas) => setEditedMeeting({ ...editedMeeting, agendas })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceSection
          attendees={meeting.attendees}
          meetingDate={meeting.date}
          onAttendanceChange={handleAttendanceChange}
        />

        <MinutesSection
          minutes={editedMeeting.minutes?.content || ''}
          meetingDate={meeting.date}
          onChange={(content) =>
            setEditedMeeting({
              ...editedMeeting,
              minutes: {
                ...editedMeeting.minutes || {
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                content,
              },
            })
          }
        />
      </div>
    </div>
  );
}