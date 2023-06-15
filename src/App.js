import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/LandingPage/Landing';
import Home from './Pages/HomePage/Home';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Landing/>} />
          <Route exact path="/home" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;