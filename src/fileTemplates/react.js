const indexFile = `import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";

const Root = () => {
    return (
        <BrowserRouter>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </BrowserRouter>
    );
};

ReactDOM.render(<Root />, document.getElementById("root"));
`;

const appFile = `import { Route, Switch } from "react-router-dom";

import Home from "../pages/Home";

const App = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
        </Switch>
    );
};

export default App;
`;

const homeFile = `const Home = () => {
    return <div>Welcome!</div>
}

export default Home;
`;

module.exports = { indexFile, appFile, homeFile };
