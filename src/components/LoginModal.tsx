
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Chrome } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials against a backend.
    // Here we'll simulate a failure for a specific password.
    if (password === 'fail') {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset shake animation
    } else {
      // For this prototype, we'll use the email as the name for the avatar.
      const name = email.split('@')[0];
      login(email, name);
      setEmail('');
      setPassword('');
    }
  };

  const handleGoogleSignIn = () => {
    // Mock Google Sign-In
    login('user@google.com', 'Googler');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="font-body bg-background/80 backdrop-blur-xl border-white/20 rounded-xl shadow-2xl w-[90vw] max-w-md animate-fade-in-scale"
      >
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-center text-primary">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sign in to access your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className={cn('space-y-6', error && 'shake')}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/50 border-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/50 border-white/30"
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          <Chrome className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          <a href="#" className="underline text-muted-foreground hover:text-primary">
            Forgot your password?
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
