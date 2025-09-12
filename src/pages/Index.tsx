import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Clock, Calculator, Percent, Lock, Star, Award, Target, Zap, CheckCircle, ArrowRight, BarChart3, PieChart, LineChart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-warning/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur border-primary/20">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                RBI Regulated
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur border-warning/20">
                <Award className="w-4 h-4 mr-2 text-warning" />
                ₹5L DICGC Insured
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur border-success/20">
                <Star className="w-4 h-4 mr-2 text-success" />
                #1 Digital FD Platform
              </Badge>
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                  <div className="relative p-4 rounded-2xl glass-card">
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold hero-text leading-tight">
                    Elite FD
                  </h1>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-muted-foreground">
                    Banking Portal
                  </h2>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                Experience the future of Fixed Deposit investments with our{" "}
                <span className="text-primary font-medium">India-first banking platform</span>.{" "}
                Intelligent portfolio management, real-time analytics, and institutional-grade security.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{animationDelay: '0.4s'}}>
              <Link to="/auth">
                <Button size="lg" className="px-10 py-6 text-lg font-semibold bg-primary hover:bg-primary-dark shadow-hero transition-all duration-300">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/calculator">
                <Button variant="outline" size="lg" className="px-10 py-6 text-lg font-medium border-2 hover:bg-card/50 backdrop-blur">
                  <Calculator className="w-5 h-5 mr-3" />
                  Smart Calculator
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <Badge variant="outline" className="px-4 py-2 mb-6 bg-primary/5 border-primary/20 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Indian Banking Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Institutional-grade features designed for sophisticated investors who demand the highest standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="glass-card hover-scale group relative overflow-hidden animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-warning to-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md"></div>
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                          <feature.icon className="w-7 h-7" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                        <div className="text-sm text-primary font-medium mt-1">{feature.subtitle}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="flex items-center mt-4 text-sm text-primary font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Intelligence Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in-up">
              <div>
                <Badge variant="outline" className="px-4 py-2 mb-6 bg-success/5 border-success/20 text-success">
                  <Target className="w-4 h-4 mr-2" />
                  Investment Intelligence
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Why Elite Investors Choose{" "}
                  <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                    Fixed Deposits
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Institutional-grade benefits that sophisticated investors rely on for portfolio stability and predictable returns.
                </p>
              </div>
              
              {advantages.map((advantage, index) => (
                <div key={advantage.title} className="flex gap-6 group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-success/10 rounded-2xl blur-md group-hover:blur-lg transition-all"></div>
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 text-success">
                        <advantage.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{advantage.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                    <div className="flex items-center text-sm font-medium text-success">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {advantage.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-8 animate-scale-in" style={{animationDelay: '0.3s'}}>
              {/* Calculator Card */}
              <Card className="glass-card p-8 relative overflow-hidden group hover-scale">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-warning/10 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                      <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AI-Powered Calculator</h3>
                      <p className="text-sm text-primary font-medium">Smart Investment Planning</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Advanced algorithms analyze market trends and provide personalized investment recommendations.
                  </p>
                  <Link to="/calculator">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary">
                      <PieChart className="w-5 h-5 mr-2" />
                      Start Smart Planning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Portfolio Tracking Card */}
              <Card className="glass-card p-8 relative overflow-hidden group hover-scale">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-success/10 to-warning/10 rounded-full blur-2xl -translate-y-16 -translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 text-success">
                      <LineChart className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Portfolio Analytics</h3>
                      <p className="text-sm text-success font-medium">Real-time Insights</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Monitor performance, track maturity dates, and optimize your investment strategy with professional-grade tools.
                  </p>
                  <Link to="/track">
                    <Button variant="outline" className="w-full border-2 hover:bg-success/5">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-warning/5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-12 animate-fade-in-up">
          <div className="space-y-6">
            <Badge variant="outline" className="px-6 py-3 text-base bg-card/50 backdrop-blur border-primary/20">
              <Star className="w-5 h-5 mr-2 text-warning" />
              Join Elite Investors
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary via-warning to-primary bg-clip-text text-transparent">
                Elevate Your Wealth
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of sophisticated investors who trust our platform for institutional-grade Fixed Deposit management and portfolio optimization.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/open-fd">
              <Button size="lg" className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-hero">
                <Plus className="w-6 h-6 mr-3" />
                Open Elite FD
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="outline" size="lg" className="px-12 py-6 text-lg font-medium border-2 hover:bg-card/50 backdrop-blur">
                <BarChart3 className="w-5 h-5 mr-3" />
                Portfolio Dashboard
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50">
            {trustIndicators.map((indicator, index) => (
              <div key={indicator.label} className="text-center space-y-3 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-2xl md:text-3xl font-bold text-primary">{indicator.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{indicator.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const stats = [
  { value: "₹50,000Cr+", label: "Assets Under Management" },
  { value: "2.5M+", label: "Active Investors" },
  { value: "8.75%", label: "Current Best Rate" }
];

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    subtitle: "Bank-Level Protection",
    description: "Multi-layered security architecture with 256-bit encryption, real-time fraud monitoring, and government insurance coverage up to ₹5 lakhs per account.",
    benefit: "100% Principal Protection"
  },
  {
    icon: Percent,
    title: "Premium Interest Rates",
    subtitle: "Market-Leading Returns",
    description: "Access exclusive interest rates ranging from 7.25% to 8.75% per annum. Our institutional partnerships ensure you get the best market rates.",
    benefit: "Up to 1.5% Higher Than Market"
  },
  {
    icon: Clock,
    title: "Smart Tenure Options",
    subtitle: "Flexible Investment Plans",
    description: "Choose from 15+ tenure options from 91 days to 10 years. Automated renewal options and partial premature withdrawal facilities available.",
    benefit: "Zero Penalty Smart Withdrawals"
  },
  {
    icon: TrendingUp,
    title: "Guaranteed Growth",
    subtitle: "Predictable Returns",
    description: "Fixed interest rates with compound growth options. Real-time portfolio tracking and performance analytics to maximize your investment potential.",
    benefit: "Compound Interest Optimization"
  },
  {
    icon: Lock,
    title: "Capital Shield Technology",
    subtitle: "Zero Market Risk",
    description: "Your principal amount is completely protected from market volatility with our proprietary risk management systems and regulatory compliance.",
    benefit: "Regulatory Compliance Guaranteed"
  },
  {
    icon: LineChart,
    title: "AI-Powered Analytics",
    subtitle: "Smart Investment Insights",
    description: "Advanced portfolio analytics, maturity planning, and personalized investment recommendations powered by machine learning algorithms.",
    benefit: "Personalized Investment Strategy"
  }
];

const advantages = [
  {
    icon: Shield,
    title: "Zero-Risk Investment Strategy",
    description: "Unlike volatile market-linked investments, our FDs provide guaranteed returns with institutional-grade capital protection, perfect for wealth preservation strategies.",
    metric: "0% Capital Loss History"
  },
  {
    icon: TrendingUp,
    title: "Exponential Compound Growth",
    description: "Harness the mathematical power of compounding with quarterly, monthly, or cumulative interest options to maximize wealth multiplication over time.",
    metric: "Up to 12% Effective Returns"
  },
  {
    icon: Clock,
    title: "Systematic Wealth Building",
    description: "Build disciplined investment habits with automated renewals and ladder strategies that prevent emotional spending and optimize long-term wealth creation.",
    metric: "Avg. 15% Annual Savings Increase"
  },
  {
    icon: Percent,
    title: "Tax Optimization Benefits",
    description: "Maximize tax efficiency with Section 80C benefits saving up to ₹46,800 annually, plus strategic maturity planning to minimize tax liability.",
    metric: "₹46,800 Annual Tax Savings"
  }
];

const trustIndicators = [
  { value: "AAA", label: "Credit Rating" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support" },
  { value: "₹5L", label: "DICGC Insured" }
];

export default Index;
