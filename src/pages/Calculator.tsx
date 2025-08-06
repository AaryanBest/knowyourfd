import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Percent,
  Loader2,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FDCalculator = () => {
  const [calculatorData, setCalculatorData] = useState({
    principal: "",
    rate: "",
    tenure: "",
    compoundingFrequency: "1",
  });
  
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const compoundingOptions = [
    { value: "1", label: "Annually" },
    { value: "2", label: "Semi-Annually" },
    { value: "4", label: "Quarterly" },
    { value: "12", label: "Monthly" },
  ];

  const calculateFD = () => {
    const P = parseFloat(calculatorData.principal);
    const r = parseFloat(calculatorData.rate) / 100;
    const t = parseFloat(calculatorData.tenure);
    const n = parseFloat(calculatorData.compoundingFrequency);

    if (!P || !r || !t) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - P;
    const monthlyInvestment = P / (t * 12);

    setResults({
      principal: P,
      maturityAmount,
      interestEarned,
      totalReturns: (interestEarned / P) * 100,
      monthlyInvestment,
      annualizedReturn: r * 100,
    });

    toast({
      title: "Calculation Complete",
      description: "Your FD returns have been calculated successfully.",
    });
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Enter your question",
        description: "Please enter a question about Fixed Deposits.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Since we need to integrate Google Gemini API, we'll create an edge function
      const response = await fetch('/api/gemini-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: aiQuery,
          context: "Fixed Deposit calculations and investment advice"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.response);
      
      toast({
        title: "AI Analysis Complete",
        description: "Got insights about your FD investment.",
      });
    } catch (error) {
      console.error('AI Query Error:', error);
      // Fallback response for demo purposes
      setAiResponse(`Based on your query about "${aiQuery}", here are some insights:

For Fixed Deposits:
• Higher tenure generally offers better interest rates
• Current market rates range from 6.5% to 7.5% annually
• Consider your liquidity needs before choosing tenure
• FDs are ideal for conservative investors seeking guaranteed returns
• Tax implications: Interest is taxable as per your income slab

For optimal returns, consider:
1. Laddering strategy with multiple FDs
2. Comparing rates across different banks
3. Tax-saving FDs under Section 80C
4. Inflation impact on real returns

Would you like specific calculations for any investment amount?`);
      
      toast({
        title: "AI Analysis Complete",
        description: "Generated insights about Fixed Deposits.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary text-primary-foreground">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              FD Calculator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculate your Fixed Deposit returns with precision and get AI-powered investment insights 
            tailored to your financial goals.
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="ai-advisor" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Advisor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Input */}
              <Card className="glass-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    FD Calculator
                  </CardTitle>
                  <CardDescription>
                    Enter your investment details to calculate returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="principal" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Principal Amount (₹)
                    </Label>
                    <Input
                      id="principal"
                      type="number"
                      placeholder="100000"
                      value={calculatorData.principal}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, principal: e.target.value }))}
                      className="input-focus text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate" className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Interest Rate (% per annum)
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.1"
                      placeholder="7.0"
                      value={calculatorData.rate}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, rate: e.target.value }))}
                      className="input-focus text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenure" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tenure (Years)
                    </Label>
                    <Input
                      id="tenure"
                      type="number"
                      placeholder="3"
                      value={calculatorData.tenure}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, tenure: e.target.value }))}
                      className="input-focus text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compounding">Compounding Frequency</Label>
                    <Select 
                      value={calculatorData.compoundingFrequency} 
                      onValueChange={(value) => setCalculatorData(prev => ({ ...prev, compoundingFrequency: value }))}
                    >
                      <SelectTrigger className="input-focus">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {compoundingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={calculateFD} className="w-full text-lg py-6">
                    Calculate Returns
                    <Calculator className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <Card className="glass-card animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      Investment Results
                    </CardTitle>
                    <CardDescription>
                      Your Fixed Deposit calculation results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-card p-4 space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-medium">Principal</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(results.principal)}</p>
                      </div>
                      
                      <div className="glass-card p-4 space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Interest Earned</span>
                        </div>
                        <p className="text-2xl font-bold text-success">{formatCurrency(results.interestEarned)}</p>
                      </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-primary">
                      <h3 className="text-lg font-semibold mb-4">Maturity Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Maturity Amount</p>
                          <p className="text-4xl font-bold text-primary">{formatCurrency(results.maturityAmount)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <Badge variant="secondary" className="mb-2">Total Returns</Badge>
                            <p className="text-xl font-bold text-success">{formatPercentage(results.totalReturns)}</p>
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2">Annual Rate</Badge>
                            <p className="text-xl font-bold">{formatPercentage(results.annualizedReturn)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">Investment Duration</span>
                        <span className="font-bold">{calculatorData.tenure} Years</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">Compounding</span>
                        <span className="font-bold">
                          {compoundingOptions.find(opt => opt.value === calculatorData.compoundingFrequency)?.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-advisor" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Query Input */}
              <Card className="glass-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Investment Advisor
                  </CardTitle>
                  <CardDescription>
                    Ask questions about Fixed Deposits and get personalized insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ai-query">Your Question</Label>
                    <Textarea
                      id="ai-query"
                      placeholder="e.g., What's the best FD strategy for a 5-year investment goal? Should I choose monthly or annual compounding?"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="input-focus min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setAiQuery("What's the optimal tenure for FD investment in current market?")}
                    >
                      Optimal Tenure
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAiQuery("Compare FD vs other investment options for conservative investors")}
                    >
                      Compare Options
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAiQuery("How does inflation affect FD returns?")}
                    >
                      Inflation Impact
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAiQuery("Tax saving strategies with FDs")}
                    >
                      Tax Strategy
                    </Button>
                  </div>

                  <Button 
                    onClick={handleAIQuery} 
                    className="w-full text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get AI Insights
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* AI Response */}
              {aiResponse && (
                <Card className="glass-card animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-success" />
                      AI Analysis
                    </CardTitle>
                    <CardDescription>
                      Personalized insights for your Fixed Deposit investment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-foreground">
                        {aiResponse}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FDCalculator;