
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Chrome, Loader2 } from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const auth = getAuth();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (signInError: any) {
          // If sign-in fails, try to sign up instead for a smoother user experience in this prototype.
          if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
          } else {
            throw signInError;
          }
        }
      }
      login(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      login(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="font-body bg-background/80 backdrop-blur-xl border-white/20 rounded-xl shadow-2xl w-[90vw] max-w-md animate-fade-in-scale"
      >
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-center text-primary">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {isSignUp ? 'Enter your details to get started.' : 'Sign in to access your account.'}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">{error}</p>}
        <form onSubmit={handleAuthAction} className={cn('space-y-6', error && 'shake')}>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>
        
        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleAuthMode} className="underline hover:text-primary">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
          <Chrome className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
