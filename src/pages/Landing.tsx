import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, Search, Image as ImageIcon, CreditCard, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
              <span className="text-xl font-bold text-foreground">Stockless</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="cta" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-subtle">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">
            License content directly
            <span className="block text-primary"> from creators</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Skip the stock photo sites. Get authentic, original content from real creators 
            with transparent licensing and instant delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="cta" size="lg" asChild className="min-w-48">
              <Link to="/login?role=buyer">
                I'm a Buyer <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="min-w-48">
              <Link to="/login?role=creator">
                I'm a Creator <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground mb-20">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>Secure licensing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Double verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How Stockless Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to get the content you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-card border-border hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Browse Creators</h3>
              <p className="text-muted-foreground">
                Discover verified creators and explore their private galleries of authentic content.
              </p>
            </Card>

            <Card className="p-8 text-center bg-card border-border hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Pick Content</h3>
              <p className="text-muted-foreground">
                Select the images or videos you want and customize your licensing terms.
              </p>
            </Card>

            <Card className="p-8 text-center bg-card border-border hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">License Instantly</h3>
              <p className="text-muted-foreground">
                Pay securely and get immediate access to high-resolution files and usage rights.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-hero text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-10 text-white/90">
            Join thousands of buyers and creators using Stockless for authentic content licensing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild className="min-w-48">
              <Link to="/login?role=buyer">Find Content</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-transparent text-white border-white hover:bg-white/10 min-w-48">
              <Link to="/login?role=creator">Sell Your Content</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-foreground">Stockless</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Stockless. Authentic content licensing made simple.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;