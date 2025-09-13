import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Camera, 
  MapPin, 
  Upload, 
  X, 
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Trash2,
  Construction,
  Zap,
  Droplets,
  TrendingUp,
  Plus
} from 'lucide-react';
import { ReportCategory, ReportSeverity } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthProvider';

interface CreateReportProps {
  onSuccess: (reportId: string) => void;
  onCancel: () => void;
}

export const CreateReport: React.FC<CreateReportProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ReportCategory,
    severity: 'medium' as ReportSeverity,
    images: [] as string[],
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const categories = [
    { value: 'pothole', label: 'Pothole', icon: Construction },
    { value: 'streetlight', label: 'Street Light', icon: Lightbulb },
    { value: 'trash', label: 'Waste Management', icon: Trash2 },
    { value: 'drainage', label: 'Drainage', icon: Droplets },
    { value: 'road_damage', label: 'Road Damage', icon: AlertTriangle },
    { value: 'traffic_signal', label: 'Traffic Signal', icon: Zap },
    { value: 'water_supply', label: 'Water Supply', icon: Droplets },
    { value: 'other', label: 'Other', icon: AlertTriangle }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' }
  ];

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding
          const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Sample Address, City`;
          
          setFormData(prev => ({
            ...prev,
            location: { latitude, longitude, address }
          }));
          setIsLoading(false);
        },
        (error) => {
          setError('Unable to get location. Please enter manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, e.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateAISuggestions = () => {
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    
    let category: ReportCategory = 'other';
    let severity: ReportSeverity = 'medium';
    
    if (text.includes('pothole') || text.includes('hole')) {
      category = 'pothole';
      severity = 'high';
    } else if (text.includes('light') || text.includes('lamp')) {
      category = 'streetlight';
      severity = 'medium';
    } else if (text.includes('trash') || text.includes('garbage') || text.includes('waste')) {
      category = 'trash';
      severity = 'low';
    } else if (text.includes('drain') || text.includes('water')) {
      category = 'drainage';
      severity = 'high';
    }

    setAiSuggestions({
      category,
      severity,
      confidence: Math.random() * 0.3 + 0.7
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title || !formData.description) {
        setError('Please fill in title and description');
        return;
      }
      generateAISuggestions();
    } else if (step === 2) {
      if (!formData.category) {
        setError('Please select a category');
        return;
      }
    } else if (step === 3) {
      if (!formData.location.address) {
        setError('Please add location information');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');

    try {
      const report = await mockApi.createReport({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        status: 'submitted',
        location: formData.location,
        images: formData.images
      });
      
      // Show success animation
      setStep(5); // Success step
      
      // Delay before navigation to show celebration
      setTimeout(() => {
        onSuccess(report.id);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
      setIsLoading(false);
    }
  };

  const applySuggestion = (field: 'category' | 'severity', value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProgressValue = () => (step / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="touch-target">
            <X className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-semibold">Report Issue</h1>
            <p className="text-xs text-muted-foreground">
              {step <= 4 ? `Step ${step} of 4` : 'Complete!'}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <Progress value={step <= 4 ? getProgressValue() : 100} className="h-1 rounded-none" />
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <Card className="civic-card animate-slide-up">
          <CardHeader className="pb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {step === 1 && "What's the issue?"}
                {step === 2 && "Categorize & Rate"}
                {step === 3 && "Where is it?"}
                {step === 4 && "Review & Submit"}
                {step === 5 && "Report Submitted! 🎉"}
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                {step === 1 && "Take photos and describe the problem"}
                {step === 2 && "Help us understand the severity"}
                {step === 3 && "Add location information"}
                {step === 4 && "Check your report before submitting"}
                {step === 5 && "Thank you for making your community better"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Information & Photos */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Photo Upload - Priority on mobile */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Photos</label>
                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 bg-primary/5">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Camera className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Take or upload photos of the issue
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-11 touch-target"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Gallery
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-11 touch-target"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Camera
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-xl"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full shadow-md"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Issue Title</label>
                  <Input
                    placeholder="What's the problem? (e.g., Large pothole)"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-12 text-base rounded-xl touch-target"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the issue, its impact, and any safety concerns..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="text-base rounded-xl resize-none"
                  />
                </div>

                {/* Tips */}
                <div className="bg-accent/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-accent-foreground mb-2">💡 Tips for better reports</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Take clear photos from multiple angles</li>
                    <li>• Include nearby landmarks or street signs</li>
                    <li>• Describe safety risks or urgency</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Category & Severity */}
            {step === 2 && (
              <div className="space-y-5">
                {aiSuggestions && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <AlertDescription>
                      <div className="space-y-3">
                        <p className="text-sm font-medium">AI Analysis Complete!</p>
                        <p className="text-sm text-muted-foreground">
                          Suggested: <span className="font-medium">{categories.find(c => c.value === aiSuggestions.category)?.label}</span> - <span className="font-medium capitalize">{aiSuggestions.severity}</span> priority
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestion('category', aiSuggestions.category)}
                            className="text-xs"
                          >
                            Use Category
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestion('severity', aiSuggestions.severity)}
                            className="text-xs"
                          >
                            Use Severity
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(({ value, label, icon: Icon }) => {
                      const isSelected = formData.category === value;
                      return (
                        <Button
                          key={value}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-16 p-4 flex flex-col gap-2 touch-target transition-all duration-200 ${
                            isSelected ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'hover:bg-muted'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, category: value as ReportCategory }))}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          <span className={`text-xs font-medium ${isSelected ? 'text-primary-foreground' : ''}`}>
                            {label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Priority Level</label>
                  <div className="space-y-2">
                    {severityOptions.map(({ value, label, color }) => {
                      const isSelected = formData.severity === value;
                      return (
                        <Button
                          key={value}
                          variant="outline"
                          className={`w-full h-14 p-4 justify-start touch-target transition-all duration-200 ${
                            isSelected ? 'border-primary bg-primary/5 shadow-md' : 'hover:bg-muted'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, severity: value as ReportSeverity }))}
                        >
                          <div className={`w-4 h-4 rounded-full mr-3 ${color}`} />
                          <div className="text-left flex-1">
                            <p className={`font-medium ${isSelected ? 'text-primary' : ''}`}>{label}</p>
                            <p className="text-xs text-muted-foreground">
                              {value === 'low' && 'Minor issue, not urgent'}
                              {value === 'medium' && 'Needs attention soon'}
                              {value === 'high' && 'Important, fix quickly'}
                              {value === 'critical' && 'Urgent safety concern'}
                            </p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {isLoading ? 'Getting Location...' : 'Use Current Location'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    placeholder="Enter the address or describe the location of the issue"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                  />
                </div>

                {formData.location.latitude !== 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Location captured: {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-medium">Review Your Report</h3>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">{formData.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {categories.find(c => c.value === formData.category)?.label}
                    </Badge>
                    <Badge variant="secondary">
                      {severityOptions.find(s => s.value === formData.severity)?.label}
                    </Badge>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{formData.location.address}</p>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 5 && (
              <div className="text-center py-8 animate-slide-up">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                
                <h3 className="text-xl font-bold text-success mb-2">Report Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  Your report has been received and will be reviewed by our team.
                </p>

                <div className="space-y-4">
                  <div className="bg-success/5 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-success mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">+10 Merit Points Earned!</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Thank you for contributing to your community
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">#REP{Date.now().toString().slice(-4)}</div>
                      <div className="text-xs text-muted-foreground">Report ID</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">2-4</div>
                      <div className="text-xs text-muted-foreground">Days ETA</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">AI ✓</div>
                      <div className="text-xs text-muted-foreground">Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Mobile Optimized */}
            {step < 5 && (
              <div className="flex gap-3 pt-6">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 h-12 touch-target rounded-xl"
                  >
                    Back
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button 
                    onClick={handleNext}
                    className={`h-12 touch-target rounded-xl font-medium ${step === 1 ? 'flex-1' : 'flex-1'}`}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="flex-1 h-12 touch-target rounded-xl font-medium bg-success hover:bg-success/90 text-success-foreground"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Submit Report
                      </div>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};