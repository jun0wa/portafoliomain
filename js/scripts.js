/*!
* Start Bootstrap - Small Business v5.0.6 (https://startbootstrap.com/template/small-business)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-small-business/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
/*!
* Start Bootstrap - Small Business v5.0.6 (https://startbootstrap.com/template/small-business)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-small-business/blob/master/LICENSE)
*/

const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Al cargar la página, revisa si ya había una preferencia guardada
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  if (toggleBtn) toggleBtn.textContent = '☀️';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Guarda la preferencia
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      toggleBtn.textContent = '☀️';
    } else {
      localStorage.setItem('theme', 'light');
      toggleBtn.textContent = '🌙';
    }
  });
}
