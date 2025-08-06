import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Calendar, Percent, TrendingUp, User, CreditCard, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FDData {
  name: string;
  client_id: string;
  tenure_years: number;
  status: 'Active' | 'Matured' | 'Closed';
  interest_rate: number;
  original_amount: number;
  current_value: number;
  maturity_date: string;
  maturity_amount: number;
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
    
    try {
      const { data, error } = await supabase
        .from('fixed_deposits')
        .select('*')
        .eq('client_id', formData.clientId)
        .eq('name', formData.name)
        .eq('tenure_years', parseInt(formData.tenure))
        .maybeSingle();

      if (error) {
        console.error('Error fetching FD data:', error);
        toast({
          title: "Error",
          description: "Failed to retrieve FD information. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setFdData(data as FDData);
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
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
    <div className="py-8 px-4">
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
                    Tenure (years)
                  </Label>
                  <Input
                    id="tenure"
                    type="number"
                    placeholder="e.g., 3"
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
                  <CardDescription>Client ID: {fdData.client_id}</CardDescription>
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
                  <p className="text-2xl font-bold">{formatCurrency(fdData.original_amount)}</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Value</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{formatCurrency(fdData.current_value)}</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm font-medium">Interest Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{fdData.interest_rate}% p.a.</p>
                  <p className="text-xs text-muted-foreground">Fixed at deposit time</p>
                </div>
                
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Maturity Date</span>
                  </div>
                  <p className="text-lg font-bold">{formatDate(fdData.maturity_date)}</p>
                </div>
              </div>
              
              <div className="glass-card p-6 border-l-4 border-l-primary">
                <h3 className="text-lg font-semibold mb-2">Maturity Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Maturity Amount</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(fdData.maturity_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Returns</p>
                    <p className="text-2xl font-bold text-success">
                      +{formatCurrency(fdData.maturity_amount - fdData.original_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FDTracker;