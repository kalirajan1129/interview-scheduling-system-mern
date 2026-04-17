import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterviewList from './pages/InterviewList';
import SlotPage from './pages/SlotPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterviewList />} />
        <Route path="/slots/:id" element={<SlotPage />} />
      </Routes>
    </Router>
  );
}

export default App;