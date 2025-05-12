import {Router} from '@vaadin/router';

// Global router değişkeni
let router;

// We are using Vaadin Router for navigation
export function initRouter(outlet) {
  // Outlet kontrolü ekleyelim - outlet yoksa hata yazdıralım
  if (!outlet) {
    console.error('Router outlet bulunamadı, router başlatılamadı!');
    return null;
  }

  try {
    // Router'ı başlat
    router = new Router(outlet);

    // Global erişim için window'a da ata
    window.appRouter = router;

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
  } catch (error) {
    console.error('Router başlatılırken hata oluştu:', error);
    return null;
  }
}

// Navigate to a new route
export function navigate(path) {
  if (router && typeof router.navigate === 'function') {
    router.navigate(path);
  } else if (
    window.appRouter &&
    typeof window.appRouter.navigate === 'function'
  ) {
    window.appRouter.navigate(path);
  } else {
    console.error('Router not initialized or navigate function not available');
    // Fallback olarak window.location kullan
    window.location.href = path;
  }
}

// Get the current route
export function getCurrentRoute() {
  return router ? router.location : null;
}
