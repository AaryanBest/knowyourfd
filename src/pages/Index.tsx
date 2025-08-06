import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Clock, Calculator, Percent, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary text-primary-foreground">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                FD Banking Portal
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Secure your financial future with our comprehensive Fixed Deposit solutions. 
              Track, manage, and optimize your investments with our modern banking platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Link to="/track">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                Track My FD
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Fixed Deposits?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of security, growth, and flexibility with our FD solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="glass-card hover-scale animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fixed Deposit Advantages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the key benefits that make Fixed Deposits the preferred choice for smart investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              {advantages.map((advantage, index) => (
                <div key={advantage.title} className="flex gap-4" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex-shrink-0 p-3 rounded-full bg-success/10 text-success">
                    <advantage.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:pl-8 animate-scale-in">
              <Card className="glass-card p-8 border-l-4 border-l-primary">
                <div className="text-center space-y-6">
                  <div className="p-4 rounded-full bg-primary/10 text-primary inline-flex">
                    <Calculator className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Calculate Your Returns</h3>
                    <p className="text-muted-foreground mb-6">
                      Use our FD calculator to estimate your maturity amount and plan your investments wisely.
                    </p>
                    <Link to="/calculator">
                      <Button className="w-full">
                        Start Calculating
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have chosen our Fixed Deposits for secure and profitable investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/track">
              <Button size="lg" className="px-8 py-4 text-lg">
                Track Existing FD
              </Button>
            </Link>
            <Link to="/open-fd">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Open New FD
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your investments are protected with bank-grade security and government insurance coverage up to ₹5 lakhs."
  },
  {
    icon: Percent,
    title: "Competitive Rates",
    description: "Enjoy attractive interest rates ranging from 6.5% to 8.5% per annum based on tenure and amount."
  },
  {
    icon: Clock,
    title: "Flexible Tenure",
    description: "Choose from various tenure options from 12 months to 10 years to match your financial goals."
  },
  {
    icon: TrendingUp,
    title: "Guaranteed Returns",
    description: "Fixed interest rates ensure predictable returns throughout your investment period."
  },
  {
    icon: Lock,
    title: "Capital Protection",
    description: "Your principal amount is completely safe with zero risk of market volatility."
  },
  {
    icon: Calculator,
    title: "Easy Tracking",
    description: "Monitor your FD performance with our user-friendly online tracking system."
  }
];

const advantages = [
  {
    icon: Shield,
    title: "Risk-Free Investment",
    description: "Unlike market-linked investments, FDs offer guaranteed returns with zero market risk, making them perfect for conservative investors."
  },
  {
    icon: TrendingUp,
    title: "Compound Growth",
    description: "Benefit from the power of compounding as your interest earns interest, maximizing your wealth over time."
  },
  {
    icon: Clock,
    title: "Disciplined Saving",
    description: "FDs encourage systematic saving habits and prevent impulsive spending by locking your funds for a fixed period."
  },
  {
    icon: Percent,
    title: "Tax Benefits",
    description: "Tax-saving FDs under Section 80C help you save up to ₹46,800 in taxes while building your corpus."
  }
];

export default Index;
