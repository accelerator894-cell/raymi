import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Posts from "@/pages/Posts";
import PostDetail from "@/pages/PostDetail";
import Crew from "@/pages/Crew";
import About from "@/pages/About";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminPostForm from "@/pages/AdminPostForm";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<AdminPostForm />} />
        <Route path="/admin/edit/:id" element={<AdminPostForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
