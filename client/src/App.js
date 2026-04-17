import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterviewList from './pages/InterviewList';
import SlotPage from './pages/SlotPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CreateInterview from './pages/CreateInterview';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InterviewList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/slots/:id"
          element={
            <ProtectedRoute>
              <SlotPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateInterview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
      
  );
}

export default App;