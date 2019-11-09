export const manifest = message =>
  JSON.stringify({
    short_name: 'Sean !Oh',
    name: message,
    icons: [
      {
        src: '/icons/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16'
      },
      {
        src: '/icons/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32'
      },
      {
        src: '/icons/icon-96x96.png',
        type: 'image/png',
        sizes: '96x96'
      },
      {
        src: '/icons/icon-144x144.png',
        type: 'image/png',
        sizes: '144x144'
      },
      {
        src: '/icons/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    start_url: '/pereritto',
    display: 'standalone',
    color: '#FFC300',
    theme_color: '#581845',
    background_color: '#900C3F',
    background_image: 'linear-gradient(155deg, #581845, #900C3F, #FF5733)',
    orientation: 'portrait-primary'
  });
