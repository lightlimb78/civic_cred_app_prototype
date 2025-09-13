import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, MapPin, Award, Users, Shield } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  const slides = [
    {
      icon: MapPin,
      title: "Report Civic Issues",
      description: "Easily report potholes, broken streetlights, and other community problems with just a few taps.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Shield,
      title: "AI-Powered Verification",
      description: "Our smart system automatically categorizes and verifies reports to ensure quality and accuracy.",
      color: "text-accent-foreground",
      bgColor: "bg-accent/10"
    },
    {
      icon: Award,
      title: "Earn Merit Points",
      description: "Get rewarded for making your community better. Earn points and redeem them for exciting rewards.",
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex flex-col items-center justify-center p-4 text-primary-foreground">
        <div className="text-center animate-slide-up">
          {/* App Logo */}
          <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <span className="text-accent-foreground text-4xl font-bold">C</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">CivicCred</h1>
          <p className="text-primary-foreground/80 text-lg">
            Building Better Communities
          </p>
          
          {/* Loading indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={skipOnboarding} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm mx-auto animate-slide-up">
          {/* Icon */}
          <div className={`w-24 h-24 ${slides[currentSlide].bgColor} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
            {React.createElement(slides[currentSlide].icon, {
              className: `h-12 w-12 ${slides[currentSlide].color}`
            })}
          </div>

          {/* Title and Description */}
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {slides[currentSlide].description}
          </p>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          <Button
            onClick={nextSlide}
            className="w-full h-12 text-base font-medium rounded-xl touch-target"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom illustration */}
      <div className="p-6 text-center">
        <div className="flex justify-center space-x-8 text-muted-foreground">
          <div className="flex flex-col items-center">
            <Users className="h-6 w-6 mb-1" />
            <span className="text-xs">Community</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="h-6 w-6 mb-1" />
            <span className="text-xs">Verified</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="h-6 w-6 mb-1" />
            <span className="text-xs">Rewards</span>
          </div>
        </div>
      </div>
    </div>
  );
};