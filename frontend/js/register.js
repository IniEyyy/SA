document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    window.location.href = 'menu.html';
    return;
  }

  const form = document.getElementById('register-form');
  const btn  = document.getElementById('register-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('register-alert');

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const confirm   = document.getElementById('confirm').value;

    if (password !== confirm) {
      showAlert('register-alert', 'Passwords do not match');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Creating account...';

    try {
      await apiPost(AUTH_URL, '/auth/register', { firstName, lastName, email, password });
      showAlert('register-alert', 'Account created! Redirecting to login...', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } catch (err) {
      showAlert('register-alert', err.message);
      btn.disabled    = false;
      btn.textContent = 'Create Account';
    }
  });
});
