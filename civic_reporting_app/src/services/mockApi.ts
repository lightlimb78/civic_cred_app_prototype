import { User, Report, ReportCategory, ReportSeverity, WalletTransaction } from '../types';

// Mock API service with localStorage persistence
class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await this.delay(1000);
    
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const token = `mock_token_${user.id}`;
    localStorage.setItem('civiccred_token', token);
    localStorage.setItem('civiccred_user', JSON.stringify(user));
    
    return { user, token };
  }

  async signup(email: string, password: string, phone: string, name: string): Promise<{ user: User; token: string }> {
    await this.delay(1000);
    
    const users = this.getStoredUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      phone,
      name,
      aadhaarVerified: false,
      meritsPoints: 0,
      reportsCount: 0,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('civiccred_users', JSON.stringify(users));
    
    const token = `mock_token_${newUser.id}`;
    localStorage.setItem('civiccred_token', token);
    localStorage.setItem('civiccred_user', JSON.stringify(newUser));
    
    return { user: newUser, token };
  }

  async verifyAadhaar(aadhaarNumber: string, otp: string): Promise<boolean> {
    await this.delay(2000);
    
    // Mock verification - always succeeds for demo
    if (otp === '123456') {
      const userStr = localStorage.getItem('civiccred_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.aadhaarVerified = true;
        localStorage.setItem('civiccred_user', JSON.stringify(user));
        
        // Update in users array
        const users = this.getStoredUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          localStorage.setItem('civiccred_users', JSON.stringify(users));
        }
      }
      return true;
    }
    
    throw new Error('Invalid OTP');
  }

  // Reports
  async createReport(reportData: Omit<Report, 'id' | 'userId' | 'aiVerified' | 'aiSuggestions' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    await this.delay(1500);
    
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const report: Report = {
      ...reportData,
      id: `report_${Date.now()}`,
      userId: user.id,
      aiVerified: true,
      aiSuggestions: this.generateAISuggestions(reportData.title, reportData.description),
      timeline: [
        {
          id: `timeline_${Date.now()}`,
          type: 'created',
          title: 'Report Created',
          description: 'Issue reported by citizen',
          timestamp: new Date().toISOString(),
          actor: user.name
        },
        {
          id: `timeline_${Date.now() + 1}`,
          type: 'verified',
          title: 'AI Verification Complete',
          description: 'Report verified by AI system',
          timestamp: new Date().toISOString(),
          actor: 'AI System'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const reports = this.getStoredReports();
    reports.push(report);
    localStorage.setItem('civiccred_reports', JSON.stringify(reports));

    // Award merit points
    this.awardMerits(user.id, 10, 'Report submission', report.id);

    return report;
  }

  async getReports(userId?: string): Promise<Report[]> {
    await this.delay(500);
    
    const reports = this.getStoredReports();
    return userId ? reports.filter(r => r.userId === userId) : reports;
  }

  async getReport(id: string): Promise<Report | null> {
    await this.delay(300);
    
    const reports = this.getStoredReports();
    return reports.find(r => r.id === id) || null;
  }

  // Wallet
  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    await this.delay(300);
    
    const transactions = this.getStoredTransactions();
    return transactions.filter(t => t.userId === userId);
  }

  // AI Mock Service
  private generateAISuggestions(title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();
    
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

    return {
      category,
      severity,
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
  }

  // Helper methods
  private getCurrentUser(): User | null {
    const userStr = localStorage.getItem('civiccred_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private getStoredUsers(): User[] {
    const usersStr = localStorage.getItem('civiccred_users');
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private getStoredReports(): Report[] {
    const reportsStr = localStorage.getItem('civiccred_reports');
    return reportsStr ? JSON.parse(reportsStr) : this.getSampleReports();
  }

  private getStoredTransactions(): WalletTransaction[] {
    const transactionsStr = localStorage.getItem('civiccred_transactions');
    return transactionsStr ? JSON.parse(transactionsStr) : [];
  }

  private awardMerits(userId: string, amount: number, reason: string, reportId?: string) {
    const transaction: WalletTransaction = {
      id: `transaction_${Date.now()}`,
      userId,
      type: 'earned',
      amount,
      reason,
      reportId,
      timestamp: new Date().toISOString()
    };

    const transactions = this.getStoredTransactions();
    transactions.push(transaction);
    localStorage.setItem('civiccred_transactions', JSON.stringify(transactions));

    // Update user merit points
    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.meritsPoints += amount;
      user.reportsCount += 1;
      localStorage.setItem('civiccred_user', JSON.stringify(user));
      
      // Update in users array
      const users = this.getStoredUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('civiccred_users', JSON.stringify(users));
      }
    }
  }

  private getSampleReports(): Report[] {
    return [
      {
        id: 'sample_1',
        userId: 'sample_user',
        title: 'Large Pothole on Main Street',
        description: 'There is a large pothole near the intersection of Main Street and Oak Avenue. It\'s causing damage to vehicles and is dangerous for cyclists.',
        category: 'pothole',
        severity: 'high',
        status: 'in_progress',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Main Street & Oak Avenue, Downtown'
        },
        images: ['https://images.unsplash.com/photo-1469510090920-fd33379d1f7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob2xlJTIwc3RyZWV0JTIwZGFtYWdlfGVufDF8fHx8MTc1NzM1NjM1MXww&ixlib=rb-4.1.0&q=80&w=1080'],
        aiVerified: true,
        timeline: [
          {
            id: 'tl_1',
            type: 'created',
            title: 'Report Created',
            description: 'Issue reported by citizen',
            timestamp: '2024-01-15T08:00:00Z',
            actor: 'John Doe'
          },
          {
            id: 'tl_2',
            type: 'verified',
            title: 'AI Verification Complete',
            description: 'Report verified by AI system',
            timestamp: '2024-01-15T08:05:00Z',
            actor: 'AI System'
          },
          {
            id: 'tl_3',
            type: 'assigned',
            title: 'Assigned to Department',
            description: 'Assigned to Public Works Department',
            timestamp: '2024-01-15T10:00:00Z',
            actor: 'System'
          },
          {
            id: 'tl_4',
            type: 'in_progress',
            title: 'Work Started',
            description: 'Repair crew dispatched to location',
            timestamp: '2024-01-16T09:00:00Z',
            actor: 'Public Works Dept'
          }
        ],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z'
      },
      {
        id: 'sample_2',
        userId: 'sample_user',
        title: 'Broken Street Light',
        description: 'Street light is not working on Park Avenue, making the area unsafe at night.',
        category: 'streetlight',
        severity: 'medium',
        status: 'resolved',
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: 'Park Avenue, Block 3'
        },
        images: ['https://images.unsplash.com/photo-1695236200077-f61c1450f21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMHVyYmFufGVufDF8fHx8MTc1NzQxMDMyNHww&ixlib=rb-4.1.0&q=80&w=1080'],
        aiVerified: true,
        timeline: [
          {
            id: 'tl_5',
            type: 'created',
            title: 'Report Created',
            description: 'Issue reported by citizen',
            timestamp: '2024-01-10T19:30:00Z',
            actor: 'Jane Smith'
          },
          {
            id: 'tl_6',
            type: 'resolved',
            title: 'Issue Resolved',
            description: 'Street light repaired and functioning',
            timestamp: '2024-01-12T14:00:00Z',
            actor: 'Electrical Dept'
          }
        ],
        createdAt: '2024-01-10T19:30:00Z',
        updatedAt: '2024-01-12T14:00:00Z'
      }
    ];
  }
}

export const mockApi = new MockApiService();