//base
import { Navigation } from "./component/navigations";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
//base importations
import ProtectedRoute from "./component/ProtectedRoute";
import NotFound from "./pages/404";
import Home from './pages/Home'
//authentication
import Login from "./pages/authentication/Login";
import Logout from "./pages/authentication/Logout";
import Register from "./pages/authentication/Register";
//project about
import ProjectCreate from "./pages/projectAbout/ProjectCreate";
import ProjectEdit from "./pages/projectAbout/ProjectEdit";
import ProjectsShow from "./pages/projectAbout/ProjectsShow";
import ProjectShow from "./pages/projectAbout/ProjectShow";
//task about
import TaskCreate from "./pages/taskAbout/taskCreate";

const App: React.FC = () => {
  return (
    <Router>

      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/project_create" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectShow/>}/>
          <Route path="/projects/:id/edit" element={<ProjectEdit />} />
          <Route path="/projects" element={<ProjectsShow />} />
          <Route path="/task_create" element={<TaskCreate />} />
        </Route>
      </Routes>
    </Router >

  )
}
export default App;