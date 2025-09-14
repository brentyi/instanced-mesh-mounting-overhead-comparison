import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import NonBatchedPage from "./pages/NonBatchedPage";
import InstancedMeshPage from "./pages/InstancedMeshPage";
import InstancedMesh2Page from "./pages/InstancedMesh2Page";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <Link to="/" className="nav-link">
            Non-batched
          </Link>
          <Link to="/instanced-mesh" className="nav-link">
            InstancedMesh
          </Link>
          <Link to="/instanced-mesh2" className="nav-link">
            InstancedMesh2
          </Link>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<NonBatchedPage />} />
            <Route path="/instanced-mesh" element={<InstancedMeshPage />} />
            <Route path="/instanced-mesh2" element={<InstancedMesh2Page />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
