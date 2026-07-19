import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Chrome, X, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import BrandLogo from './BrandLogo';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { saveUserToFirestore } from '../lib/firebaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const ADMIN_EMAILS = [
  'info.shorif0000@gmail.com',
  'geminizksipro@gmail.com',
  'admin@digimarkt.bd',
  'admin@gmail.com'
];

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) {
      setError('Email address is required.');
      return;
    }

    const emailLower = email.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(emailLower)) {
      setError('Access Denied: This is an Administrator email. Please log in using the Admin security portal instead.');
      return;
    }

    try {
      if (isForgot) {
        await sendPasswordResetEmail(auth, email);
        setInfo('Password reset link has been sent to your email. Check your inbox!');
        setTimeout(() => {
          setIsForgot(false);
          setIsLogin(true);
        }, 3000);
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (isLogin) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        const mockUser: UserProfile = {
          name: fbUser.displayName || fbUser.email?.split('@')[0].toUpperCase() || 'DEVELOPER',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${fbUser.email}`,
          phone: '',
          joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
          wishlist: [],
          purchasedProductIds: []
        };
        setInfo('Welcome back! Sign in successful.');
        setTimeout(() => {
          onSuccess(mockUser);
          onClose();
        }, 1500);
      } else {
        // Sign Up
        if (!name) {
          setError('Display name is required.');
          return;
        }

        if (phone && !/^(?:\+8801|01)[3-9]\d{8}$/.test(phone)) {
          setError('Please provide a valid Bangladeshi phone number (e.g. 01712345678).');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        const fullProfile: UserProfile = {
          name: name,
          email: email,
          avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
          phone: phone ? `+880${phone}` : '',
          joinedDate: new Date().toISOString(),
          wishlist: [],
          purchasedProductIds: []
        };
        
        await saveUserToFirestore(fbUser.uid, fullProfile);
        
        setInfo('Account created successfully! Welcome to DigiMarkt BD.');
        setTimeout(() => {
          onSuccess(fullProfile);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setInfo('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const fbUser = userCredential.user;
      
      const email = fbUser.email || '';
      
      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        await auth.signOut();
        setError('Access Denied: This is an Administrator email. Please log in using the Admin security portal instead.');
        return;
      }

      const name = fbUser.displayName || email.split('@')[0];
      const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
      
      const profile: UserProfile = {
        name,
        email,
        avatar,
        phone: '',
        joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
        wishlist: [],
        purchasedProductIds: []
      };
      
      await saveUserToFirestore(fbUser.uid, profile);
      setInfo('Logged in via Google Secure Auth!');
      setTimeout(() => {
        onSuccess(profile);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        id="auth-modal-content"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
          id="close-auth-modal"
        >
          <X size={18} />
        </button>

        {/* Branding Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <BrandLogo size="md" variant="dark" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isForgot ? 'Reset your password' : isLogin ? 'Sign in to DigiMarkt' : 'Create an account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isForgot
              ? 'Enter your email to receive recovery instructions.'
              : isLogin
              ? 'Get instant access to premium digital products'
              : 'Join the community of 12,000+ Bangladeshi developers'}
          </p>
        </div>

        {/* Action Feedbacks */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-2.5 text-xs"
              id="auth-error"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {info && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-start gap-2.5 text-xs"
              id="auth-info"
            >
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{info}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Name Field (Sign Up only) */}
          {!isLogin && !isForgot && (
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                id="auth-name-input"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
              id="auth-email-input"
              required
            />
          </div>

          {/* Phone Field (Sign Up only) */}
          {!isLogin && !isForgot && (
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">+880</span>
              <input
                type="tel"
                placeholder="Mobile Number (e.g., 1712345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-16 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                id="auth-phone-input"
              />
            </div>
          )}

          {/* Password Field (Sign In / Sign Up only) */}
          {!isForgot && (
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                id="auth-password-input"
                required
              />
            </div>
          )}

          {/* Forgot Password Link (Sign In only) */}
          {isLogin && !isForgot && (
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                id="auth-forgot-trigger"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-blue-200 hover:scale-[1.01] transition-all cursor-pointer"
            id="auth-submit-btn"
          >
            <span>
              {isForgot ? 'Send Recovery Link' : isLogin ? 'Sign In' : 'Create Free Account'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Alternate Options */}
        {!isForgot && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
              id="google-signin-btn"
            >
              <Chrome size={18} className="text-blue-600" />
              <span>Sign in with Google</span>
            </button>
          </>
        )}

        {/* Modal Footer Toggle */}
        <div className="text-center mt-6 text-xs text-slate-500">
          {isForgot ? (
            <button
              onClick={() => {
                setIsForgot(false);
                setIsLogin(true);
              }}
              className="font-bold text-blue-600 hover:underline"
              id="back-to-login"
            >
              Back to Sign In
            </button>
          ) : isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="font-bold text-blue-600 hover:underline"
                id="toggle-signup"
              >
                Sign Up for Free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="font-bold text-blue-600 hover:underline"
                id="toggle-login"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
