import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Releases from './pages/Release'
import Issues from './pages/Issues'
import DeploymentLogs from './pages/DeploymentLogs'
import IssueDetail from './pages/IssueDetail'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/deployment-logs" element={<DeploymentLogs />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App
