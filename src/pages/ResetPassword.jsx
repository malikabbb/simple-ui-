import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import authService from '../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    // Get email and token from URL parameters
    const urlEmail = searchParams.get('email');
    const urlToken = searchParams.get('token');
    
    if (!urlEmail || !urlToken) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    setEmail(urlEmail);
    setToken(urlToken);
    
    // Verify token validity
    verifyToken(urlEmail, urlToken);
  }, [searchParams]);

  const verifyToken = async (email, token) => {
    try {
      const result = await authService.verifyToken(email, token);
      setTokenValid(result.success);
      if (!result.success) {
        setError(result.message || 'Invalid or expired token. Please request a new password reset.');
      }
    } catch (err) {
      setTokenValid(false);
      setError('Token verification failed. Please request a new password reset.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const resetData = {
      email: email,
      token: token,
      password: password,
      password_confirmation: confirmPassword,
    };

    try {
      const result = await authService.resetPassword(resetData);
      
      if (result.success) {
        setMessage('Password has been reset successfully. You can now log in with your new password.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600">Verifying reset token...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <Link to="/forgot-password">
                <Button>Request New Reset Link</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-white">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <div className="w-8 h-8 bg-primary rounded-lg shadow-sm"></div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset password</CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="font-medium text-slate-700">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="font-medium text-slate-700">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
            required
            minLength="8"
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="confirmPassword" className="font-medium text-slate-700">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
            required
            minLength="8"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-5 pt-4">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || message}
          className="w-full h-11 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
