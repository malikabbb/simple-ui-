import { Link } from "react-router-dom";
import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import authService from "../services/authService";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const formData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    };

    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        // Redirect to dashboard or home page after successful registration
        window.location.href = '/dashboard';
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <div className="w-8 h-8 bg-primary rounded-lg shadow-sm"></div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create an account</CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="space-y-2 text-left">
          <Label htmlFor="name" className="font-medium text-slate-700">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
            required
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="font-medium text-slate-700">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
            required
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="font-medium text-slate-700">Password</Label>
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
          <Label htmlFor="confirmPassword" className="font-medium text-slate-700">Confirm Password</Label>
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
          disabled={loading}
          className="w-full h-11 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
