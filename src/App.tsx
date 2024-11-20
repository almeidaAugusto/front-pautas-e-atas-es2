import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Members } from './pages/Members';
import { MeetingDetails } from './pages/MeetingDetails';
import { CreateMeeting } from './pages/CreateMeeting';
import { Login } from './pages/Login';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/membros"
            element={
              <Layout>
                <Members />
              </Layout>
            }
          />
          <Route
            path="/meetings/new"
            element={
              <Layout>
                <CreateMeeting />
              </Layout>
            }
          />
          <Route
            path="/meetings/:id"
            element={
              <Layout>
                <MeetingDetails />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}