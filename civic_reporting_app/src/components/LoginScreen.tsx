import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Phone, Mail, Lock } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface LoginScreenProps {
  onToggleMode: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* App Logo/Header */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-primary-foreground text-3xl font-bold">C</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">CivicCred</h1>
        <p className="text-muted-foreground text-sm">
          Report civic issues, build better communities
        </p>
      </div>

      <Card className="w-full max-w-sm mx-auto civic-card animate-slide-up">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-sm">
            Sign in to continue making a difference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {error && (
            <Alert variant="destructive" className="animate-slide-up">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-border focus:ring-2 focus:ring-primary touch-target"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 touch-target transition-all duration-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Alternative Sign In Options */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 touch-target">
                <Phone className="mr-2 h-4 w-4" />
                <span className="text-sm">Phone</span>
              </Button>
              <Button variant="outline" className="h-11 touch-target">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm">Google</span>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="p-3 bg-muted/50 rounded-lg mb-4">
              <p className="text-xs text-muted-foreground">
                Demo: Use any email with password "password123"
              </p>
            </div>
            
            <Button variant="ghost" onClick={onToggleMode} className="text-sm touch-target">
              Don't have an account? <span className="text-primary ml-1">Sign up</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};