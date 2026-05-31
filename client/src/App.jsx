// client/src/App.jsx

// 1. Import necessary components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 2. Import our page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// You can also import any global components like a Navbar here in the future
// import Navbar from './components/Navbar';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    // 3. Wrap the entire application with BrowserRouter
    // This component enables routing capabilities for the entire app.
    <Router>
      {/* A Navbar component would typically go here, outside the Routes,
          so it appears on every page. We'll add this later. */}
          <div className="bg-slate-100 min-h-screen text-slate-800" >
            <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        {/* 4. Define the routes within the Routes component */}
        {/* The Routes component looks through its children <Route>s to find
            the best match and renders that route's component. */}
        <Routes>
          {/* 5. Define each individual route */}
          {/* Each Route maps a URL path to a specific component. */}
          
          {/* Route for the Home page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route for the Login page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Route for the Register page */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Route for the User Dashboard page */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;