import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Truck,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Report, TimelineEvent } from '../types';
import { mockApi } from '../services/mockApi';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReportDetailProps {
  reportId: string;
  onBack: () => void;
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ reportId, onBack }) => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const reportData = await mockApi.getReport(reportId);
      if (reportData) {
        setReport(reportData);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'verified': return 'bg-green-500';
      case 'assigned': return 'bg-yellow-500';
      case 'in_progress': return 'bg-orange-500';
      case 'resolved': return 'bg-emerald-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: Report['status']) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'in_progress': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created': return MessageSquare;
      case 'verified': return CheckCircle;
      case 'assigned': return User;
      case 'in_progress': return Truck;
      case 'resolved': return CheckCircle;
      case 'rejected': return AlertTriangle;
      default: return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pothole': return '🕳️';
      case 'streetlight': return '💡';
      case 'trash': return '🗑️';
      case 'drainage': return '💧';
      case 'road_damage': return '🚧';
      case 'traffic_signal': return '🚦';
      case 'water_supply': return '🚰';
      default: return '⚠️';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{error || 'Report not found'}</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(report.category)}</span>
            <div>
              <h1 className="text-xl font-semibold">{report.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Report #{report.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {report.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.images.map((image, index) => (
                    <ImageWithFallback
                      key={index}
                      src={image}
                      alt={`${report.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {report.description}
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Timeline</CardTitle>
              <CardDescription>Track the status of your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {report.timeline.map((event, index) => {
                  const Icon = getTimelineIcon(event.type);
                  const isLast = index === report.timeline.length - 1;
                  
                  return (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {!isLast && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-6 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        {event.actor && (
                          <p className="text-xs text-muted-foreground mt-1">
                            by {event.actor}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {report.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Severity</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                      <span className="text-sm text-muted-foreground capitalize">
                        {report.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {report.location.address}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Verification */}
          {report.aiVerified && report.aiSuggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  AI Verified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  This report has been automatically verified by our AI system.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">
                      {Math.round(report.aiSuggestions.confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AI Category</span>
                    <span className="font-medium capitalize">
                      {report.aiSuggestions.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AI Severity</span>
                    <span className="font-medium capitalize">
                      {report.aiSuggestions.severity}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                View on Map
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};