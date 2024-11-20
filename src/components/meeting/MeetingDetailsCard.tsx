import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Meeting } from '../../types/meeting';
import { cn } from '../../lib/utils';

interface MeetingDetailsCardProps {
  meeting: Meeting;
}

export function MeetingDetailsCard({ meeting }: MeetingDetailsCardProps) {
  const navigate = useNavigate();

  const formattedTime = format(new Date(meeting.date), 'HH:mm', { locale: ptBR });
  const remainingAgendas = meeting.agendas.length - 2;

  return (
    <div
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{meeting.title}</h3>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{formattedTime}</span> - {meeting.location}
          </p>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          'bg-blue-100 text-blue-800'
        )}>
          Hoje
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Pautas Principais</h4>
          <ul className="space-y-2">
            {meeting.agendas.slice(0, 2).map((agenda) => (
              <li key={agenda.id} className="text-gray-600 text-sm">
                {agenda.title}
              </li>
            ))}
            {remainingAgendas > 0 && (
              <li className="text-sm text-blue-600">
                +{remainingAgendas} {remainingAgendas === 1 ? 'pauta' : 'pautas'}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Participantes</h4>
          <div className="flex flex-wrap gap-2">
            {meeting.attendees.slice(0, 3).map((attendee) => (
              <span
                key={attendee.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {attendee.name}
              </span>
            ))}
            {meeting.attendees.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{meeting.attendees.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}