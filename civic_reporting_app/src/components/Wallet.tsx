import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  Award, 
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Star,
  Calendar,
  Target
} from 'lucide-react';
import { WalletTransaction } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthProvider';

export const Wallet: React.FC = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userTransactions = await mockApi.getWalletTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRedeemed = transactions
    .filter(t => t.type === 'redeemed')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = user?.meritsPoints || 0;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const achievements = [
    {
      id: 'first_report',
      title: 'First Reporter',
      description: 'Submit your first civic report',
      points: 10,
      completed: (user?.reportsCount || 0) >= 1,
      icon: Award
    },
    {
      id: 'verified_citizen',
      title: 'Verified Citizen',
      description: 'Complete Aadhaar verification',
      points: 50,
      completed: user?.aadhaarVerified || false,
      icon: Star
    },
    {
      id: 'community_hero',
      title: 'Community Hero',
      description: 'Submit 10 verified reports',
      points: 100,
      completed: (user?.reportsCount || 0) >= 10,
      icon: Trophy
    },
    {
      id: 'point_collector',
      title: 'Point Collector',
      description: 'Earn 100 merit points',
      points: 25,
      completed: currentBalance >= 100,
      icon: Target
    }
  ];

  const rewards = [
    {
      id: 'coffee_voucher',
      title: 'Coffee Voucher',
      description: 'Get a free coffee from partner cafes',
      cost: 50,
      available: true
    },
    {
      id: 'movie_ticket',
      title: 'Movie Ticket',
      description: 'Free movie ticket at partner theaters',
      cost: 100,
      available: true
    },
    {
      id: 'transport_credit',
      title: 'Transport Credit',
      description: '₹50 credit for public transport',
      cost: 75,
      available: true
    },
    {
      id: 'donation',
      title: 'Charity Donation',
      description: 'Donate points to local NGOs',
      cost: 25,
      available: true
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Merit Wallet</h1>
          <p className="text-muted-foreground">
            Earn points for civic contributions and redeem rewards
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Current Balance</p>
                <p className="text-3xl font-bold">{currentBalance}</p>
                <p className="text-blue-100 text-sm">Merit Points</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <WalletIcon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">{totalEarned}</p>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Redeemed</p>
                <p className="text-2xl font-bold text-orange-600">{totalRedeemed}</p>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest merit point transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start reporting civic issues to earn merit points
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earned' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'earned' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className={achievement.completed ? 'bg-green-50 border-green-200' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        achievement.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{achievement.title}</h3>
                          {achievement.completed && (
                            <Badge variant="default" className="text-xs">Completed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">{achievement.points} points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Gift className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <WalletIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{reward.cost} points</span>
                    </div>
                    
                    <Button
                      variant={currentBalance >= reward.cost ? "default" : "outline"}
                      size="sm"
                      disabled={currentBalance < reward.cost}
                    >
                      {currentBalance >= reward.cost ? 'Redeem' : 'Not enough points'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">More Rewards Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're partnering with local businesses to bring you more ways to redeem your merit points.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};