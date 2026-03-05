import Router, { Route } from "preact-router";
import { UsersDashboard } from "./pages/UsersDashboard";
import "./app.css";
import { Links } from "./links";

export function App() {
  return (
    <Router>
      <Route path="/" component={Links} />
      <Route path="/users" component={UsersDashboard} />
      {/* TODO: historicals dashboard */}
    </Router>
  );
}
