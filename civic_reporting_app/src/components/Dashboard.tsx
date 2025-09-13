import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Report } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  onCreateReport: () => void;
  onViewReport: (reportId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateReport, onViewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [userReports, communityReports] = await Promise.all([
        mockApi.getReports(user.id),
        mockApi.getReports()
      ]);
      setReports(userReports);
      setAllReports(communityReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
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

  const stats = {
    totalReports: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    pending: reports.filter(r => !['resolved', 'rejected'].includes(r.status)).length,
    points: user?.meritsPoints || 0
  };

  const recentCommunityReports = allReports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome Section - Mobile First */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Hi {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ready to make your community better?
            </p>
          </div>
          {user?.aadhaarVerified && (
            <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Quick Actions Row - Mobile Priority */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={onCreateReport}
            className="h-16 bg-primary hover:bg-primary/90 text-primary-foreground flex flex-col gap-1 touch-target"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium">Report Issue</span>
          </Button>
          <Button 
            variant="outline"
            className="h-16 flex flex-col gap-1 touch-target hover:bg-muted"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs">My Reports</span>
          </Button>
          <Button 
            variant="outline"
            className="h-16 flex flex-col gap-1 touch-target hover:bg-muted"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Button>
          <Button 
            variant="outline"
            className="h-16 flex flex-col gap-1 touch-target hover:bg-muted"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs">Activity</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="civic-card">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalReports}</p>
                <p className="text-xs text-muted-foreground">Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="civic-card">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-success/10 rounded-xl">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="civic-card">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-warning/10 rounded-xl">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="civic-card">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-accent/10 rounded-xl">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Preview Card - Mobile First */}
      <Card className="civic-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Nearby Issues</CardTitle>
              <CardDescription className="text-sm">Issues in your area</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View Map
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-32 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
            {/* Mock map with pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-warning rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-xs text-muted-foreground">{recentCommunityReports.length} active issues</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* My Recent Reports */}
        <Card className="civic-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">My Reports</CardTitle>
                <CardDescription className="text-sm">Your civic contributions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {reports.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">No reports yet</p>
                <Button onClick={onCreateReport} size="sm" className="touch-target">
                  <Plus className="mr-2 h-4 w-4" />
                  Report First Issue
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 cursor-pointer transition-all duration-200 touch-target"
                    onClick={() => onViewReport(report.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {report.location.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs px-2 py-0.5">
                          {report.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Activity Feed */}
        <Card className="civic-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Community Feed</CardTitle>
                <CardDescription className="text-sm">Latest nearby reports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentCommunityReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 cursor-pointer transition-all duration-200 touch-target"
                  onClick={() => onViewReport(report.id)}
                >
                  {report.images.length > 0 ? (
                    <ImageWithFallback
                      src={report.images[0]}
                      alt={report.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{report.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {report.location.address}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs px-2 py-0.5">
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreateReport}
        className="fab"
        aria-label="Report new issue"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};