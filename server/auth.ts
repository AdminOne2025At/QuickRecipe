import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';
import { pool } from './db';
import { User, insertUserSchema } from '@shared/schema';

// تهيئة مخزن جلسات PostgreSQL
const PostgresStore = connectPg(session);
const sessionStore = new PostgresStore({
  pool: pool,
  tableName: 'sessions',
  createTableIfMissing: true
});

// تسجيل النطاق في حقل السر للمساعدة في تحديد الجلسات
const SESSION_SECRET = process.env.SESSION_SECRET || 'quick-recipe-local-dev-secret';
console.log(`[AUTH] Using session secret: ${SESSION_SECRET ? '✓ Set' : '❌ Not set'}`);
console.log(`[AUTH] Session store initialized with PostgreSQL connection`);

// Crypto helpers for password hashing
const scryptAsync = promisify(scrypt);

/**
 * تشفير كلمة المرور باستخدام scrypt مع salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${derivedKey.toString('hex')}.${salt}`;
}

/**
 * مقارنة كلمة المرور المقدمة مع كلمة المرور المخزنة بشكل آمن من هجمات التوقيت
 */
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    const [hashedPassword, salt] = stored.split('.');
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
    const suppliedHashBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    return timingSafeEqual(hashedPasswordBuf, suppliedHashBuf);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * إعداد المصادقة مع Passport.js وإنشاء مسارات API للمصادقة
 * @returns middlewares للتحقق من المصادقة
 */
export function setupAuth(app: Express): { isAuthenticated: (req: Request, res: Response, next: NextFunction) => void; isAdmin: (req: Request, res: Response, next: NextFunction) => void } {
  // Session configuration
  const sessionOptions = {
    store: sessionStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true, // تم تغييرها لتخزين الجلسات غير المهيأة
    name: 'qr.sid', // اسم الكوكي المخصص
    cookie: {
      secure: false, // إيقاف مؤقت للـ HTTPS المطلوب للكوكيز الآمنة
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      path: '/',
      sameSite: 'lax' as const, // تصحيح نوع البيانات
    },
  };
  
  console.log(`[AUTH] Setting up session with options:`, {
    store: 'PostgreSQL',
    secret: sessionOptions.secret ? 'Set' : 'Not set',
    resave: sessionOptions.resave,
    saveUninitialized: sessionOptions.saveUninitialized,
    cookieOptions: {
      secure: sessionOptions.cookie.secure,
      httpOnly: sessionOptions.cookie.httpOnly,
      sameSite: sessionOptions.cookie.sameSite,
    }
  });
  
  app.use(session(sessionOptions));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration for local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'اسم المستخدم غير موجود' });
        }

        const passwordValid = await comparePasswords(password, user.password);
        if (!passwordValid) {
          return done(null, false, { message: 'كلمة المرور غير صحيحة' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
  };

  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user as User).isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'غير مصرح بالوصول' });
  };

  // Authentication routes
  // Register new user
  app.post('/api/register', async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      // التحقق من وجود المستخدم
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });
      }

      // تشفير كلمة المرور
      const hashedPassword = await hashPassword(password);

      // إنشاء مستخدم جديد
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        isAdmin: false, // المستخدمون الجدد ليسوا مشرفين بشكل افتراضي
      });

      // تسجيل الدخول بعد التسجيل
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
    }
  });

  // Login
  app.post('/api/login', (req, res, next) => {
    console.log(`[AUTH] Login attempt for username: ${req.body.username || 'unknown'}`);
    
    passport.authenticate('local', (err: Error | null, user: User | false, info: { message?: string } | undefined) => {
      if (err) {
        console.error('[AUTH] Login error:', err);
        return next(err);
      }
      
      if (!user) {
        console.log(`[AUTH] Login failed for ${req.body.username}: ${info?.message || 'Unknown reason'}`);
        return res.status(401).json({ message: info?.message || 'فشل تسجيل الدخول' });
      }
      
      console.log(`[AUTH] User authenticated successfully: ${user.username} (id: ${user.id})`);
      
      req.login(user, async (err: Error | null) => {
        if (err) {
          console.error('[AUTH] Session creation error:', err);
          return next(err);
        }
        
        try {
          // إرسال إشعار تسجيل الدخول (إذا لزم الأمر)
          // تم تنفيذه في واجهة المستخدم
          
          // تأكيد تسجيل الدخول بنجاح
          console.log(`[AUTH] Login complete - session established for ${user.username}`);
          
          // إرجاع بيانات المستخدم بدون كلمة المرور
          const { password, ...userWithoutPassword } = user;
          res.json(userWithoutPassword);
        } catch (error) {
          console.error('[AUTH] Error in login process:', error);
          next(error);
        }
      });
    })(req, res, next);
  });

  // Admin Login - same endpoint with different credentials
  app.post('/api/admin/login', (req, res, next) => {
    console.log(`[AUTH] Admin login attempt for username: ${req.body.username || 'unknown'}`);
    
    passport.authenticate('local', (err: Error | null, user: User | false, info: { message?: string } | undefined) => {
      if (err) {
        console.error('[AUTH] Admin login error:', err);
        return next(err);
      }
      
      // التحقق إذا كان المستخدم موجود ومسؤول
      if (!user) {
        console.log(`[AUTH] Admin login failed - user not found: ${req.body.username}`);
        return res.status(401).json({ message: 'بيانات اعتماد غير صحيحة للمشرف' });
      }
      
      if (!user.isAdmin) {
        console.log(`[AUTH] Admin login failed - user not admin: ${user.username}`);
        return res.status(401).json({ message: 'حساب المستخدم غير مصرح له بصلاحيات المشرف' });
      }
      
      console.log(`[AUTH] Admin authenticated successfully: ${user.username} (id: ${user.id})`);
      
      req.login(user, (err: Error | null) => {
        if (err) {
          console.error('[AUTH] Admin session creation error:', err);
          return next(err);
        }
        
        console.log(`[AUTH] Admin login complete - session established for ${user.username}`);
        
        // إرجاع بيانات المستخدم المسؤول بدون كلمة المرور
        const { password, ...adminWithoutPassword } = user;
        res.json(adminWithoutPassword);
      });
    })(req, res, next);
  });

  // Guest Login - create temporary user account
  app.post('/api/guest/login', async (req, res) => {
    console.log('[AUTH] Guest login attempt');
    
    try {
      // إنشاء اسم مستخدم فريد للزائر
      const guestUsername = `guest_${Date.now()}`;
      const guestPassword = `guest_${randomBytes(16).toString('hex')}`;
      console.log(`[AUTH] Created guest account: ${guestUsername}`);
      
      // تشفير كلمة المرور
      const hashedPassword = await hashPassword(guestPassword);
      
      // إنشاء كائن مستخدم زائر متوافق مع المخطط
      const newUser = {
        username: guestUsername,
        password: hashedPassword,
        isAdmin: false,
        isGuest: true,
        lastLogin: new Date()
      };
      
      // إنشاء حساب زائر مؤقت
      const guestUser = await storage.createUser(newUser);
      console.log(`[AUTH] Guest user created in database with ID: ${guestUser.id}`);
      
      // تسجيل دخول الزائر
      req.login(guestUser, (err: Error | null) => {
        if (err) {
          console.error('[AUTH] Guest login session error:', err);
          return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول كزائر' });
        }
        
        console.log(`[AUTH] Guest login complete - session established for ${guestUser.username}`);
        
        // إرجاع بيانات الزائر بدون كلمة المرور
        const { password, ...userWithoutPassword } = guestUser;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error('[AUTH] Error creating guest account:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء حساب زائر' });
    }
  });

  // Logout
  app.post('/api/logout', (req, res) => {
    const user = req.user;
    if (user) {
      console.log(`[AUTH] Logout request for user: ${(user as User).username}`);
    } else {
      console.log('[AUTH] Logout request for non-authenticated session');
    }
    
    req.logout((err) => {
      if (err) {
        console.error('[AUTH] Logout error:', err);
        return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الخروج' });
      }
      console.log('[AUTH] Logout successful - session terminated');
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error('[AUTH] Session destruction error:', sessionErr);
        }
        res.json({ message: 'تم تسجيل الخروج بنجاح' });
      });
    });
  });

  // Get current user info
  app.get('/api/user', (req, res) => {
    console.log(`[AUTH] User info request - is authenticated: ${req.isAuthenticated()}`);
    console.log(`[AUTH] Session ID: ${req.sessionID || 'none'}`);
    
    if (!req.isAuthenticated() || !req.user) {
      console.log('[AUTH] User not authenticated for /api/user request');
      return res.status(401).json({ message: 'المستخدم غير مسجل الدخول' });
    }
    
    console.log(`[AUTH] Returning user data for: ${(req.user as User).username}`);
    
    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  return {
    isAuthenticated,
    isAdmin,
  };
}