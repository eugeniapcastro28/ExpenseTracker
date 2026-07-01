import { useState } from 'react';
import { login, signup } from '../../api/auth.js';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  async function handleAuth(e) {
    e.preventDefault();
    setError('');
    const authFn = isSignup ? signup : login;
    const result = await authFn(email, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      onLogin();
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Expense Tracker</h1>
        <p>{isSignup ? 'Create your account' : 'Welcome back'}</p>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-auth">{isSignup ? 'Sign up' : 'Log in'}</button>
        </form>
        <button className="btn-toggle" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;