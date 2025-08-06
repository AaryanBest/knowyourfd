import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  Percent, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OpenFD = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    address: "",
    panCard: "",
    aadharCard: "",
    
    // FD Details
    depositAmount: "",
    tenure: "",
    interestPayout: "maturity",
    nomineeDetails: "",
    
    // Banking Details
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const { toast } = useToast();

  const interestRates = [
    { tenure: "1 Year", rate: "6.5%", category: "Standard" },
    { tenure: "2 Years", rate: "6.8%", category: "Standard" },
    { tenure: "3 Years", rate: "7.0%", category: "Premium" },
    { tenure: "5 Years", rate: "7.25%", category: "Premium" },
    { tenure: "10 Years", rate: "7.5%", category: "Elite" },
  ];

  const benefits = [
    { icon: Shield, title: "100% Secure", description: "Government backed with DICGC insurance up to ₹5 lakhs" },
    { icon: TrendingUp, title: "Competitive Returns", description: "Industry-leading interest rates up to 7.5% per annum" },
    { icon: Clock, title: "Flexible Tenure", description: "Choose from 1 to 10 years based on your goals" },
    { icon: CheckCircle, title: "Easy Processing", description: "Quick approval with minimal documentation" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['fullName', 'email', 'phone', 'depositAmount', 'tenure'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to proceed.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your FD application has been submitted successfully. You will receive a confirmation email shortly.",
    });

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      panCard: "",
      aadharCard: "",
      depositAmount: "",
      tenure: "",
      interestPayout: "maturity",
      nomineeDetails: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    });
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const calculateMaturityAmount = () => {
    const principal = parseFloat(formData.depositAmount) || 0;
    const years = parseFloat(formData.tenure) || 0;
    const rate = years === 1 ? 6.5 : years === 2 ? 6.8 : years === 3 ? 7.0 : years === 5 ? 7.25 : 7.5;
    
    return principal * Math.pow(1 + (rate / 100), years);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <Plus className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Open New Fixed Deposit
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start your investment journey with our secure and profitable Fixed Deposit schemes. 
            Enjoy guaranteed returns with flexible tenure options.
          </p>
        </div>

        {/* Interest Rates Section */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Current Interest Rates
            </CardTitle>
            <CardDescription>
              Choose the tenure that best fits your investment goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {interestRates.map((rate, index) => (
                <div key={rate.tenure} className="glass-card p-4 text-center space-y-2 hover-scale">
                  <Badge variant={rate.category === "Elite" ? "default" : rate.category === "Premium" ? "secondary" : "outline"}>
                    {rate.category}
                  </Badge>
                  <div className="text-2xl font-bold text-primary">{rate.rate}</div>
                  <div className="text-sm text-muted-foreground">{rate.tenure}</div>
                  <div className="text-xs text-muted-foreground">per annum</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {benefits.map((benefit, index) => (
            <Card key={benefit.title} className="glass-card hover-scale" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary inline-flex">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              FD Application Form
            </CardTitle>
            <CardDescription>
              Fill in your details to open a new Fixed Deposit account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
              </TabsList>

              <TabsContent value="application" className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="input-focus"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="input-focus"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="input-focus"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="panCard">PAN Card Number</Label>
                        <Input
                          id="panCard"
                          placeholder="ABCDE1234F"
                          value={formData.panCard}
                          onChange={(e) => handleInputChange('panCard', e.target.value)}
                          className="input-focus"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="input-focus"
                      />
                    </div>
                  </div>

                  {/* FD Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Fixed Deposit Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">Deposit Amount *</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="100000"
                          value={formData.depositAmount}
                          onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                          className="input-focus"
                        />
                        {formData.depositAmount && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(formData.depositAmount)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Tenure *</Label>
                        <Select value={formData.tenure} onValueChange={(value) => handleInputChange('tenure', value)}>
                          <SelectTrigger className="input-focus">
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Year (6.5% p.a.)</SelectItem>
                            <SelectItem value="2">2 Years (6.8% p.a.)</SelectItem>
                            <SelectItem value="3">3 Years (7.0% p.a.)</SelectItem>
                            <SelectItem value="5">5 Years (7.25% p.a.)</SelectItem>
                            <SelectItem value="10">10 Years (7.5% p.a.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interestPayout">Interest Payout</Label>
                        <Select value={formData.interestPayout} onValueChange={(value) => handleInputChange('interestPayout', value)}>
                          <SelectTrigger className="input-focus">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maturity">At Maturity</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Maturity Calculation */}
                    {formData.depositAmount && formData.tenure && (
                      <div className="glass-card p-6 border-l-4 border-l-primary">
                        <h4 className="text-lg font-semibold mb-4">Maturity Calculation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Principal Amount</p>
                            <p className="text-2xl font-bold">{formatCurrency(formData.depositAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Interest Earned</p>
                            <p className="text-2xl font-bold text-success">
                              +{formatCurrency((calculateMaturityAmount() - parseFloat(formData.depositAmount)).toString())}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Maturity Amount</p>
                            <p className="text-3xl font-bold text-primary">
                              {formatCurrency(calculateMaturityAmount().toString())}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" size="lg" className="px-8">
                      Submit Application
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => setActiveTab("preview")}>
                      Preview Application
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">Application Preview</h3>
                  <p className="text-muted-foreground">Review your details before submission</p>
                </div>
              </TabsContent>

              <TabsContent value="confirmation" className="space-y-6">
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
                  <p className="text-muted-foreground">Your FD application has been received and is being processed.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpenFD;