import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Releases from './pages/Release'
import Issues from './pages/Issues'
import DeploymentLogs from './pages/DeploymentLogs'
import IssueDetail from './pages/IssueDetail'
import Login from './pages/Login';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            }/> 

          <Route path="/login" element={<Login />} />
          <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }/>
          <Route path="/releases" element={
            <ProtectedRoute>
              <Releases />
            </ProtectedRoute>
            } />
          <Route path="/issues" element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          } />
          <Route path="/deployment-logs" element={
            <ProtectedRoute>
              <DeploymentLogs />
            </ProtectedRoute>
            } />
          <Route path="/issues/:id" element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App
