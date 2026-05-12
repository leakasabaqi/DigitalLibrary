import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => {
    return {
      // Minimal mocks so App can render in Jest (no real routing needed for this test)
      BrowserRouter: ({ children }) => children,
      Routes: ({ children }) => children,
      Route: ({ element }) => element,
      Link: ({ to, children }) => <a href={to || "#"}>{children}</a>,
      useLocation: () => ({ pathname: "/" }),
    };
  },
  { virtual: true }
);

import App from "./App";

test("renders the admin dashboard layout", () => {
  render(<App />);
  // AdminLayout always shows this text in the sidebar/topbar
  expect(screen.getAllByText(/Digital Library Admin/i).length).toBeGreaterThan(0);
});
