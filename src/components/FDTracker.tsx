import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Calendar, Percent, TrendingUp, User, CreditCard, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FDData {
  name: string;
  clientId: string;
  tenure: number;
  status: 'Active' | 'Matured' | 'Closed';
  interestRate: number;
  originalAmount: number;
  currentValue: number;
  maturityDate: string;
  maturityAmount: number;
}

const FDTracker = () => {
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    tenure: ''
  });
  const [fdData, setFdData] = useState<FDData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration - replace with actual API call
  const mockFDData: Record<string, FDData> = {
    'FD001': {
      name: 'John Doe',
      clientId: 'FD001',
      tenure: 36,
      status: 'Active',
      interestRate: 7.5,
      originalAmount: 100000,
      currentValue: 125000,
      maturityDate: '2025-12-15',
      maturityAmount: 127500
    },
    'FD002': {
      name: 'Jane Smith',
      clientId: 'FD002',
      tenure: 60,
      status: 'Matured',
      interestRate: 8.0,
      originalAmount: 250000,
      currentValue: 350000,
      maturityDate: '2024-06-20',
      maturityAmount: 350000
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.clientId || !formData.tenure) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock API response - replace with actual Google Sheets API call
    const result = mockFDData[formData.clientId];
    
    if (result && result.name.toLowerCase() === formData.name.toLowerCase()) {
      setFdData(result);
      toast({
        title: "FD Details Retrieved",
        description: "Successfully loaded your Fixed Deposit information.",
      });
    } else {
      toast({
        title: "No Record Found",
        description: "Please verify your details and try again.",
        variant: "destructive"
      });
      setFdData(null);
    }
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'status-active',
      'Matured': 'status-matured',
      'Closed': 'status-closed'
    };
    
    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]} px-3 py-1 font-medium`}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              FD Tracker
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your Fixed Deposits with ease. Enter your details below to check your investment status, 
            maturity amount, and current value.
          </p>
        </div>

        {/* Search Form */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Find Your Fixed Deposit
            </CardTitle>
            <CardDescription>
              Enter your details to retrieve your FD information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-focus"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientId" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Client ID
                  </Label>
                  <Input
                    id="clientId"
                    placeholder="e.g., FD001"
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    className="input-focus"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenure" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tenure (months)
                  </Label>
                  <Input
                    id="tenure"
                    type="number"
                    placeholder="e.g., 36"
                    value={formData.tenure}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                    className="input-focus"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8 py-3 text-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Track My FD'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="glass-card animate-scale-in">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full glass-card shimmer flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-48 mx-auto shimmer"></div>
                  <div className="h-3 bg-muted rounded w-32 mx-auto shimmer"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FD Result Card */}
        {fdData && !loading && (
          <Card className="glass-card animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">Fixed Deposit Details</CardTitle>
                  <CardDescription>Client ID: {fdData.clientId}</CardDescription>
                </div>
                {getStatusBadge(fdData.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Original Amount</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(fdData.originalAmount)}</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Value</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{formatCurrency(fdData.currentValue)}</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm font-medium">Interest Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{fdData.interestRate}% p.a.</p>
                  <p className="text-xs text-muted-foreground">Fixed at deposit time</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Maturity Date</span>
                  </div>
                  <p className="text-lg font-bold">{formatDate(fdData.maturityDate)}</p>
                </div>
              </div>
              
              <div className="glass-card p-6 border-l-4 border-l-primary">
                <h3 className="text-lg font-semibold mb-2">Maturity Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Maturity Amount</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(fdData.maturityAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Returns</p>
                    <p className="text-2xl font-bold text-success">
                      +{formatCurrency(fdData.maturityAmount - fdData.originalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">How Fixed Deposits Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🔒 Secure Investment</h4>
                <p>Fixed Deposits offer guaranteed returns with capital protection and fixed interest rates.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">📈 Fixed Returns</h4>
                <p>Interest rates are locked at the time of deposit and remain unchanged throughout the tenure.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">⏰ Flexible Tenure</h4>
                <p>Choose from various tenure options from 12 months to 10 years based on your financial goals.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FDTracker;