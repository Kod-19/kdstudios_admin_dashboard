import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Only registered admin accounts are allowed access.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_18%_14%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(245,158,11,0.12),transparent_28%),#030712] p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white">KD Studios Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your website and operations.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kdstudios.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-500/10 transition duration-200 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
