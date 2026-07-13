import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<div className="flex h-screen items-center justify-center text-4xl font-bold text-gradient">Project Phoenix</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
