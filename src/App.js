import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import CreateForm from './CreateForm';
import UserForm from './UserForm';

const App = () => {
  const routes = createBrowserRouter([
    {
      path:"/",
      element: <Dashboard />
    },
    {
      path:"/dashboard",
      element: <Dashboard />
    },
    {
      path:"/dashboard/create-form",
      element: <CreateForm />
    },
    {
      path:"/:form_id",
      element: <UserForm />
    }
  ]);

  return (
    <RouterProvider router={routes} />
);
}

export default App;
