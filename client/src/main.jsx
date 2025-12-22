import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

async function enableMocking() {
  // Enable MSW in both development and production & it is allowing the app to work on Netlify with mockdata
  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <BrowserRouter>
        {/* <StrictMode> */}
        <App />
        {/* </StrictMode> */}
      </BrowserRouter>
    </Provider>
  );
});
