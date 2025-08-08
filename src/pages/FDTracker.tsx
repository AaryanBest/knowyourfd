import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Calendar, Percent, TrendingUp, User, CreditCard, Clock, FileText, UploadCloud } from "lucide-react";
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

  // New: document analysis states
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docResult, setDocResult] = useState<any | null>(null);

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

  const handleAnalyzeDoc = async () => {
    if (!docFile) {
      toast({ title: "Upload a file", description: "Please choose your FD PDF or document.", variant: "destructive" });
      return;
    }

    setDocLoading(true);
    setDocResult(null);
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({ title: "Sign in required", description: "Please sign in to analyze documents.", variant: "destructive" });
        return;
      }

      const path = `${user.id}/${Date.now()}_${docFile.name}`;
      const { error: uploadError } = await supabase.storage.from('fd-docs').upload(path, docFile, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) {
        console.error(uploadError);
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        return;
      }

      // Invoke Edge Function to parse the document
      const { data, error } = await supabase.functions.invoke('parse-fd-doc', {
        body: { path }
      });

      if (error) {
        console.error(error);
        toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
        return;
      }

      setDocResult(data);
      toast({ title: "Analysis complete", description: "We extracted key details from your document." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not analyze the document.", variant: "destructive" });
    } finally {
      setDocLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'status-active',
      'Matured': 'status-matured',
      'Closed': 'status-closed'
    } as const;
    
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

        {/* New: FD Document Analyzer */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Analyze FD Document (PDF)
            </CardTitle>
            <CardDescription>Upload your FD receipt/sanction letter and we'll extract key details for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
              <div>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                  disabled={docLoading}
                />
              </div>
              <Button onClick={handleAnalyzeDoc} disabled={docLoading} className="md:w-48">
                {docLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>

            {docResult && (
              <div className="mt-4 space-y-4">
                {docResult?.extracted && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docResult.extracted.name && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="text-lg font-semibold">{docResult.extracted.name}</div>
                      </div>
                    )}
                    {docResult.extracted.client_id && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Client ID</div>
                        <div className="text-lg font-semibold">{docResult.extracted.client_id}</div>
                      </div>
                    )}
                    {docResult.extracted.interest_rate && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Interest Rate</div>
                        <div className="text-lg font-semibold">{docResult.extracted.interest_rate}% p.a.</div>
                      </div>
                    )}
                    {docResult.extracted.tenure_years && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Tenure</div>
                        <div className="text-lg font-semibold">{docResult.extracted.tenure_years} years</div>
                      </div>
                    )}
                    {docResult.extracted.original_amount && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="text-lg font-semibold">{formatCurrency(docResult.extracted.original_amount)}</div>
                      </div>
                    )}
                    {docResult.extracted.maturity_date && (
                      <div className="glass-card p-4">
                        <div className="text-sm text-muted-foreground">Maturity Date</div>
                        <div className="text-lg font-semibold">{docResult.extracted.maturity_date}</div>
                      </div>
                    )}
                  </div>
                )}
                {docResult?.summary && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-base">AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {docResult.summary}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
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
