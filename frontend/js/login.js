document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    window.location.href = 'menu.html';
    return;
  }

  const form = document.getElementById('login-form');
  const btn  = document.getElementById('login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('login-alert');

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    btn.disabled    = true;
    btn.textContent = 'Signing in...';

    try {
      const data = await apiPost(AUTH_URL, '/auth/login', { email, password });
      saveToken(data.access_token);
      saveUser(data.user);

      if (data.user.role === 'ADMIN') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'menu.html';
      }
    } catch (err) {
      showAlert('login-alert', err.message);
      btn.disabled    = false;
      btn.textContent = 'Sign In';
    }
  });
});
