import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Creator } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Camera } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'creator' | null>(
    (searchParams.get('role') as 'buyer' | 'creator') || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: 'Please select your role',
        description: 'Choose whether you are a buyer or creator',
        variant: 'destructive'
      });
      return;
    }

    if (isRegister && !name.trim()) {
      toast({
        title: 'Name is required',
        description: 'Please enter your name',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      
      if (isRegister) {
        result = await register(email, password, selectedRole, name);
        
        if (!result.success) {
          toast({
            title: 'Registration failed',
            description: result.error || 'User with this email already exists',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        toast({
          title: 'Account created!',
          description: 'Registration successful. Please check your email to confirm your account.',
        });
      } else {
        result = await login(email, password, selectedRole);
        
        if (!result.success) {
          toast({
            title: 'Login failed',
            description: result.error || 'Invalid credentials or role mismatch',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        toast({
          title: 'Welcome back!',
          description: 'Login successful',
        });
        
        // Navigate based on role - get user ID from result
        if (selectedRole === 'buyer') {
          navigate('/buyers');
        } else {
          // Use the user ID from the login result, or wait for context
          setTimeout(() => {
            if (user?.id) {
              navigate(`/creator-dashboard/${user.id}`);
            } else {
              // Force reload to get fresh auth state
              window.location.href = '/';
            }
          }, 200);
        }
      }
    } catch (error) {
      toast({
        title: isRegister ? 'Registration error' : 'Login error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'buyer' | 'creator') => {
    setSelectedRole(role);
    if (role === 'buyer') {
      setEmail('buyer@example.com');
      setPassword('password123');
    } else {
      setEmail('creator@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Stockless</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>{isRegister ? 'Register' : 'Login'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedRole && (
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium">I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2" 
                    onClick={() => setSelectedRole('buyer')}
                  >
                    <Users className="w-6 h-6" />
                    <span>Buyer</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2" 
                    onClick={() => setSelectedRole('creator')}
                  >
                    <Camera className="w-6 h-6" />
                    <span>Creator</span>
                  </Button>
                </div>
              </div>
            )}

            {selectedRole && (
              <>
                <div className="mb-6 p-4 bg-muted rounded-lg flex items-center gap-3">
                  {selectedRole === 'buyer' ? <Users className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">{isRegister ? 'Registering' : 'Signing in'} as {selectedRole}</p>
                    <button 
                      onClick={() => setSelectedRole(null)}
                      className="text-sm text-primary hover:underline"
                    >
                      Change role
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="cta"
                  >
                    {isLoading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-sm text-primary hover:underline"
                  >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gradient-subtle rounded-lg border">
                  <p className="text-sm font-medium mb-3">Demo Credentials:</p>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fillDemoCredentials('buyer')}
                      className="w-full justify-start text-sm h-8"
                    >
                      <Users className="w-3 h-3 mr-2" />
                      Buyer: buyer@example.com
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fillDemoCredentials('creator')}
                      className="w-full justify-start text-sm h-8"
                    >
                      <Camera className="w-3 h-3 mr-2" />
                      Creator: creator@example.com
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Create a new account to test the app, or contact admin for demo access</p>
        </div>
      </div>
    </div>
  );
};

export default Login;