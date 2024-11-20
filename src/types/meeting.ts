export interface Agenda {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Minutes {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  agendas: Agenda[];
  minutes?: Minutes;
  attendees: Member[];
}