import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { User, Phone, Mail, Lock } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface SignupScreenProps {
  onToggleMode: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signup(email, password, phone, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* App Logo/Header */}
      <div className="text-center mb-6 animate-slide-up">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-primary-foreground text-2xl font-bold">C</span>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-1">Join CivicCred</h1>
        <p className="text-muted-foreground text-sm">
          Start making your community better today
        </p>
      </div>

      <Card className="w-full max-w-sm mx-auto civic-card animate-slide-up">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg text-foreground">Create Account</CardTitle>
          <CardDescription className="text-sm">
            Join thousands making a difference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {error && (
            <Alert variant="destructive" className="animate-slide-up">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 touch-target transition-all duration-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you agree to our{' '}
              <span className="text-primary">Terms of Service</span> and{' '}
              <span className="text-primary">Privacy Policy</span>
            </p>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onToggleMode} className="text-sm touch-target">
              Already have an account? <span className="text-primary ml-1">Sign in</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};