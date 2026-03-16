import { Link } from "react-router-dom";
import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import authService from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setMessage('Password reset link has been sent to your email address.');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Password reset request failed. Please try again.');
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
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset password</CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Enter your email address and we'll send you a link to reset your password.
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
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-4 bg-slate-50/50 border-slate-200"
            required
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
          {loading ? 'Sending...' : 'Send reset link'}
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
