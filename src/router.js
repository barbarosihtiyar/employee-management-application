import {Router} from '@vaadin/router';

let router;

// We are using Vaadin Router for navigation
export function initRouter(outlet) {
  router = new Router(outlet);

  router.setRoutes([
    {
      path: '/',
      redirect: '/employees',
    },
    {
      path: '/employees',
      component: 'employee-list',
      action: async () => {
        await import('./components/employee-list.js');
      },
    },
    {
      path: '/employees/new',
      component: 'employee-form',
      action: async () => {
        await import('./components/employee-form.js');
      },
    },
    {
      path: '/employees/:id/edit',
      component: 'employee-form',
      action: async () => {
        await import('./components/employee-form.js');
      },
    },
    {
      path: '(.*)',
      component: 'not-found-view',
      action: async () => {
        await import('./components/not-found-view.js');
      },
    },
  ]);

  return router;
}

// Navigate to a new route
export function navigate(path) {
  if (router) {
    router.navigate(path);
  } else {
    console.error('Router not initialized');
  }
}

// Get the current route
export function getCurrentRoute() {
  return router ? router.location : null;
}
