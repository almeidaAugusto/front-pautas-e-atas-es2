import axios from 'axios';
import { Meeting, Agenda, Minutes, Member } from '../types/meeting';

const api = axios.create({
  baseURL: '/api',
});

// Helper function to get today's date at a specific time
const getTodayAt = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Reunião de Planejamento Estratégico',
    date: '2024-03-25T14:00:00',
    location: 'Sala de Conferência A',
    status: 'scheduled',
    agendas: [
      {
        id: '1',
        title: 'Revisão de Metas Q1',
        description: 'Análise do desempenho e resultados do primeiro trimestre',
        order: 1,
      },
      {
        id: '2',
        title: 'Planejamento Q2',
        description: 'Definição de objetivos e estratégias para o próximo trimestre',
        order: 2,
      },
    ],
    attendees: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
      },
    ],
  },
  {
    id: '2',
    title: 'Retrospectiva de Projeto',
    date: '2024-03-20T10:00:00',
    location: 'Sala Virtual (Google Meet)',
    status: 'completed',
    agendas: [
      {
        id: '3',
        title: 'Análise de Resultados',
        description: 'Avaliação dos objetivos alcançados',
        order: 1,
      },
    ],
    attendees: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
      },
    ],
    minutes: {
      id: '1',
      content: 'Durante a reunião, foram discutidos os principais pontos do projeto...',
      createdAt: '2024-03-20T12:00:00',
      updatedAt: '2024-03-20T12:00:00',
    },
  },
  // Reunião de hoje para demonstração
  {
    id: '3',
    title: 'Reunião de Alinhamento Semanal',
    date: getTodayAt(14, 30),
    location: 'Sala de Reuniões Principal',
    status: 'scheduled',
    agendas: [
      {
        id: '4',
        title: 'Atualizações dos Times',
        description: 'Cada líder de equipe apresentará o progresso semanal',
        order: 1,
      },
      {
        id: '5',
        title: 'Próximos Passos',
        description: 'Definição das prioridades para a próxima semana',
        order: 2,
      },
      {
        id: '6',
        title: 'Pontos de Atenção',
        description: 'Discussão sobre desafios e bloqueios atuais',
        order: 3,
      }
    ],
    attendees: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro@exemplo.com',
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana@exemplo.com',
      }
    ],
  },
];

export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    // For development, return mock data
    return Promise.resolve(mockMeetings);
  },

  getById: async (id: string): Promise<Meeting> => {
    // For development, find meeting in mock data
    const meeting = mockMeetings.find(m => m.id === id);
    if (!meeting) {
      throw new Error('Reunião não encontrada');
    }
    return Promise.resolve(meeting);
  },

  create: async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
    const { data } = await api.post('/meetings', meeting);
    return data;
  },

  update: async (id: string, meeting: Partial<Meeting>): Promise<Meeting> => {
    const { data } = await api.put(`/meetings/${id}`, meeting);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },
};

export const membersApi = {
  getAll: async (): Promise<Member[]> => {
    // Mock data para desenvolvimento
    return Promise.resolve([
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        role: 'manager',
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        role: 'member',
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro@exemplo.com',
        role: 'member',
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana@exemplo.com',
        role: 'member',
      },
    ]);
  },

  create: async (member: Omit<Member, 'id' | 'role'>): Promise<Member> => {
    const { data } = await api.post('/members', member);
    return data;
  },

  update: async (id: string, member: Partial<Member>): Promise<Member> => {
    const { data } = await api.put(`/members/${id}`, member);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },
};