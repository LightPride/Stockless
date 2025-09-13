import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRight, Shield, Zap, Users, Search, Image as ImageIcon, CreditCard, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

const Landing = () => {
  const carouselPhotos = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop'
  ];

  const ladderPhotos = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=120&h=120&fit=crop' },
  ];

  const underLadderPhotos = [
    { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop' },
  ];

  const fillerPhotos = [
    { src: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1487260211189-670c54da558d?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=120&h=120&fit=crop' },
    { src: 'https://images.unsplash.com/photo-1515378791036-0648a814897e?w=120&h=120&fit=crop' },
  ];

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
      <section className="py-24 px-6 bg-gradient-subtle relative overflow-hidden">
        {/* Ladder Photo Layout */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-30">
          {/* Main ladder */}
          <div className="flex flex-col space-y-4">
            {ladderPhotos.map((photo, index) => (
              <div
                key={index}
                className="transition-all duration-500 hover:scale-125 hover:opacity-100 hover:shadow-xl hover:z-10 relative cursor-pointer"
                style={{
                  marginLeft: `${index * 40}px`
                }}
              >
                <img
                  src={photo.src}
                  alt={`Gallery photo ${index + 1}`}
                  className="w-24 h-24 rounded-lg shadow-lg hover:shadow-2xl object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Filler photos in between ladder steps */}
          <div className="absolute top-16 left-12">
            {fillerPhotos.map((photo, index) => (
              <div
                key={`filler-${index}`}
                className="absolute transition-all duration-500 hover:scale-125 hover:opacity-100 hover:shadow-xl hover:z-10 cursor-pointer"
                style={{
                  top: `${index * 90 + 20}px`,
                  left: `${index * 25 + 20}px`
                }}
              >
                <img
                  src={photo.src}
                  alt={`Filler photo ${index + 1}`}
                  className="w-16 h-16 rounded-lg shadow-lg object-cover opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
          
          {/* Under ladder photos */}
          <div className="flex flex-col space-y-3 mt-8">
            {underLadderPhotos.map((photo, index) => (
              <div
                key={`under-${index}`}
                className="transition-all duration-500 hover:scale-125 hover:opacity-100 hover:shadow-xl hover:z-10 relative cursor-pointer"
                style={{
                  marginLeft: `${(underLadderPhotos.length - index - 1) * 35}px`
                }}
              >
                <img
                  src={photo.src}
                  alt={`Under ladder photo ${index + 1}`}
                  className="w-20 h-20 rounded-lg shadow-lg object-cover opacity-80 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">
            License content directly
            <span className="block text-primary"> from creators</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Authentic videos and photos with transparent licencing and instant delivery.
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

      {/* Photo Carousel */}
      <section className="py-12 bg-card border-y border-border overflow-hidden">
        <div className="container mx-auto px-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Featured Content</h2>
          <p className="text-center text-muted-foreground">Discover authentic photos from our creator community</p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {[...carouselPhotos, ...carouselPhotos].map((photo, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/3 md:basis-1/5 lg:basis-1/6">
                <div className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={photo}
                    alt={`Featured photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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