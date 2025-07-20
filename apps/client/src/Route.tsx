import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Header } from "./component/Header";
import SideBar from "./component/SideBar";
import FileManager from "./views/FileManager";
import Home from "./views/Home";
import { LoginPage } from "./views/Login";
import PostTable from "./views/PostTable";
import Blog from "./views/blog/Blog";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const Expire = localStorage.getItem("Expire");
  if (Expire && Date.now().toString() < Expire) {
    // return children;
  }
  return children;
  return <Navigate to="/login" replace />;
};

export const RouteWrapper = () => {
  return (
    <Router>
      <div className="App mx-auto overflow-hidden">
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex gap-2 h-screen">
                  <SideBar />
                  <div className="flex-1 px-4 overflow-scroll">
                    <Header />
                    <main>
                      <div className="pb-10">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/table" element={<PostTable />} />
                          <Route path="/file" element={<FileManager />} />
                          <Route path="/blog/:Id" element={<Blog />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  );
};
