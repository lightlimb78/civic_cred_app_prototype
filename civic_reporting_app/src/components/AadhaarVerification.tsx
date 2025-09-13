import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Upload, Shield, Smartphone } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthProvider';

interface AadhaarVerificationProps {
  onComplete: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateUser } = useAuth();

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const isVerified = await mockApi.verifyAadhaar(aadhaarNumber, otp);
      if (isVerified && user) {
        const updatedUser = { ...user, aadhaarVerified: true };
        updateUser(updatedUser);
        setStep(3);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressValue = () => {
    switch (step) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Aadhaar Verification</CardTitle>
          <CardDescription>
            Verify your identity to unlock all features
          </CardDescription>
          <Progress value={getProgressValue()} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <form onSubmit={handleAadhaarSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aadhaar Number</label>
                <Input
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  maxLength={12}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your Aadhaar details are encrypted and stored securely
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <Smartphone className="mx-auto h-8 w-8 text-blue-600" />
                <p className="text-sm">
                  OTP sent to your registered mobile number
                </p>
                <p className="text-xs text-muted-foreground">
                  For demo purposes, use OTP: <Badge variant="secondary">123456</Badge>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <Input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Back to Aadhaar Entry
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Verification Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your Aadhaar has been successfully verified. You now have access to all CivicCred features.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Verified User Benefits:
                </div>
                <ul className="mt-2 text-xs text-green-600 space-y-1">
                  <li>• Higher priority for your reports</li>
                  <li>• Earn bonus merit points</li>
                  <li>• Access to premium features</li>
                </ul>
              </div>

              <Button onClick={onComplete} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};