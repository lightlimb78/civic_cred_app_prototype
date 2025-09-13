import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MapPin, 
  Search, 
  Filter,
  Navigation,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Report, ReportCategory, ReportStatus } from '../types';
import { mockApi } from '../services/mockApi';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MapViewProps {
  onCreateReport: () => void;
  onViewReport: (reportId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onCreateReport, onViewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, searchQuery, categoryFilter, statusFilter]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const allReports = await mockApi.getReports();
      setReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reports;

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const getMarkerColor = (status: ReportStatus, severity: string) => {
    if (status === 'resolved') return 'bg-green-500';
    if (status === 'rejected') return 'bg-red-500';
    
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'resolved': return CheckCircle;
      case 'in_progress': return Clock;
      case 'rejected': return AlertTriangle;
      default: return MapPin;
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pothole', label: 'Pothole' },
    { value: 'streetlight', label: 'Street Light' },
    { value: 'trash', label: 'Waste Management' },
    { value: 'drainage', label: 'Drainage' },
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'traffic_signal', label: 'Traffic Signal' },
    { value: 'water_supply', label: 'Water Supply' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'verified', label: 'Verified' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Community Map</h1>
          <p className="text-muted-foreground">
            View civic issues reported in your area
          </p>
        </div>
        <Button onClick={onCreateReport} className="hidden md:flex">
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReportCategory | 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Map
              </CardTitle>
              <CardDescription>
                Click on markers to view report details
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full p-0">
              {/* Mock Map Interface */}
              <div className="relative h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="shadow-md">
                    <Navigation className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="shadow-md">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mock Markers */}
                <div className="absolute inset-0">
                  {filteredReports.slice(0, 8).map((report, index) => {
                    const Icon = getStatusIcon(report.status);
                    return (
                      <div
                        key={report.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${20 + (index % 4) * 20}%`,
                          top: `${20 + Math.floor(index / 4) * 30}%`
                        }}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className={`p-2 rounded-full shadow-lg ${getMarkerColor(report.status, report.severity)} hover:scale-110 transition-transform`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {selectedReport?.id === report.id && (
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-64 z-10">
                            <div className="flex items-start gap-3">
                              {report.images[0] && (
                                <ImageWithFallback
                                  src={report.images[0]}
                                  alt={report.title}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{report.title}</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {report.location.address}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {report.status.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {report.severity}
                                  </Badge>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewReport(report.id);
                                  }}
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="font-medium text-sm mb-2">Legend</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span>Critical/High</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Nearby Issues ({filteredReports.length})
            </h3>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewReport(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getMarkerColor(report.status, report.severity)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{report.title}</h4>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {report.location.address}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {report.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {report.category.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-20 right-4">
        <Button
          size="lg"
          className="rounded-full shadow-lg"
          onClick={onCreateReport}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};