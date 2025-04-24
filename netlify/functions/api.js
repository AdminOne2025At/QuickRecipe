// Netlify Serverless Function for Quick Recipe API
const { Pool } = require('pg');
const express = require('express');
const serverless = require('serverless-http');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const bodyParser = require('body-parser');

// تحسين أداء Netlify Functions عن طريق إعادة استخدام الاتصالات
let pool;
let app;

// إنشاء تطبيق Express مرة واحدة
const setupApi = () => {
  if (app) return app;

  const app = express();
  app.use(bodyParser.json());

  // إعداد الاتصال بقاعدة البيانات
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  // إعداد الجلسة
  app.use(session({
    secret: process.env.SESSION_SECRET || 'quickrecipe-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 1000 // ساعة واحدة
    }
  }));

  // إعداد المصادقة
  app.use(passport.initialize());
  app.use(passport.session());

  // تنفيذ استراتيجية المصادقة المحلية
  const scryptAsync = promisify(scrypt);
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      
      const user = result.rows[0];
      if (!user) {
        return done(null, false, { message: 'اسم المستخدم غير صحيح' });
      }

      const [hashedPassword, salt] = user.password.split('.');
      const hashedInputBuffer = await scryptAsync(password, salt, 64);
      const storedHashBuffer = Buffer.from(hashedPassword, 'hex');
      
      // مقارنة كلمات المرور بأمان
      const passwordMatch = timingSafeEqual(hashedInputBuffer, storedHashBuffer);
      
      if (!passwordMatch) {
        return done(null, false, { message: 'كلمة المرور غير صحيحة' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // مسارات API
  // نقطة اختبار API
  app.get('/status', (req, res) => {
    res.json({
      status: 'online',
      user: req.user ? { id: req.user.id, username: req.user.username } : null,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // مسار المصادقة
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'غير مصرح' });
    }
  });

  // عند إيقاف الاتصال، إغلاق اتصال قاعدة البيانات
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    if (pool) {
      console.log('Closing DB pool connections.');
      pool.end();
    }
  });

  return app;
};

// إنشاء الدالة الرئيسية لـ Netlify Function
exports.handler = async (event, context) => {
  // إنهاء الاتصال عند الانتهاء من المعالجة
  context.callbackWaitsForEmptyEventLoop = false;
  
  // إعداد تطبيق Express
  const app = setupApi();
  
  // تحويل Express app إلى serverless handler
  const handler = serverless(app);
  
  // معالجة الطلب
  return handler(event, context);
};