import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Index from "./pages/index";
import Converter from "./pages/ytconverter";
import Contact from "./pages/contact";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/converter" element={<Converter />} />
                    <Route path="/contact" element={<Contact />} />

                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
