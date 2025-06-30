import NiceModal from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSetAtom } from "jotai/react";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { Header } from "./component/Header";
import SideBar from "./component/SideBar";
import { initSocketAtom } from "./store/atom/socketAtom";
import Blog from "./views/blog/Blog"
import FileManager from "./views/FileManager"

import Home from "./views/Home"
import { LoginPage } from "./views/Login"
import PostTable from "./views/PostTable"
import ResizeTab from "./component/ResizeTab"
const queryClient = new QueryClient()
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const Expire = localStorage.getItem("Expire")
  if (Expire && Date.now().toString() < Expire) {
    // return children;
  }
  return children
  return <Navigate to="/login" replace />
}

function App() {
  const initSocket = useSetAtom(initSocketAtom)
  useEffect(() => {
    const cleanup = initSocket()
    return cleanup
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        <Router>
          <div className="App mx-auto overflow-hidden">
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex gap-2 h-screen p">
                      <SideBar />
                      <div className="flex-1">
                        <Header />
                        <main className="h-full overflow-scroll ">
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
      </NiceModal.Provider>
    </QueryClientProvider>
  )
}

export default App;
