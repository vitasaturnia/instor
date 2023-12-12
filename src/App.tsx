import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Index from "./pages/index";
import Converter from "./pages/ytconverter";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/converter" element={<Converter />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
