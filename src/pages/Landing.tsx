import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">Stockless</span>
            </div>
            <div className="flex gap-4">
              <Button variant="minimal" asChild>
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
      <section className="py-24 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            License real content,
            <br />
            directly from creators
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Find content. License it. Simple. Get authentic creator content with full protection - 
            no direct contact needed, complete privacy for both parties.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="hero" size="lg" asChild className="min-w-48">
              <Link to="/login?role=buyer">
                I'm a Buyer <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="creator" size="lg" asChild className="min-w-48">
              <Link to="/login?role=creator">
                I'm a Creator <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground mb-20">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure licensing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Double verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">How Stockless Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center shadow-soft hover:shadow-medium smooth-transition border-0 bg-gradient-subtle">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse Creators</h3>
              <p className="text-muted-foreground">
                Discover authentic content from verified creators. Filter by style, restrictions, and usage rights.
              </p>
            </Card>

            <Card className="p-8 text-center shadow-soft hover:shadow-medium smooth-transition border-0 bg-gradient-subtle">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Pick Content</h3>
              <p className="text-muted-foreground">
                Select the perfect images or videos from private creator galleries. See usage restrictions upfront.
              </p>
            </Card>

            <Card className="p-8 text-center shadow-soft hover:shadow-medium smooth-transition border-0 bg-gradient-subtle">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">License Instantly</h3>
              <p className="text-muted-foreground">
                AI-powered contracts, instant licensing, immediate download. Get what you need, when you need it.
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
            Join thousands of creators and brands using Stockless for authentic content licensing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild className="bg-white text-primary hover:bg-white/90 border-white min-w-48">
              <Link to="/login?role=buyer">Find Content</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-transparent text-white border-white hover:bg-white/10 min-w-48">
              <Link to="/login?role=creator">Sell Your Content</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-background border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-hero rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold">Stockless</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Stockless. Connecting creators and TV producers through authentic content licensing.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;