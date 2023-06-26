import helmet from 'helmet';
import noCache from 'nocache';
import Express from 'express';

/**
 * Configure the Security headers for the application
 * @param {Express} app the Express App object
 */
export const SecurityConfig = (app) => {
  // Remove powered by express header
  app.disable('x-powered-by');
  app.use(helmet.ieNoOpen()); // Some IE security bug
  app.use(helmet.noSniff()); // MIME Type sniffing by browsers can be exploited
  app.use(noCache()); // Don't cache old code
  app.use(helmet.xssFilter());

  // Used to prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // CSP enabling for XSS Prevention
  // app.use(helmet.contentSecurityPolicy({
  //   // Specify directives as normal.
  //   directives: {
  //     // defaultSrc: ["'self'",'csi.gstatic.com'],
  //     // scriptSrc: ["'self'",'maps.googleapis.com','csi.gstatic.com'],
  //     // styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com','csi.gstatic.com'],
  //     fontSrc: ['fonts.gstatic.com'],
  //     sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  //     reportUri: '/report-violation'
  //   },
  //
  //   reportOnly: false,
  //   setAllHeaders: false,
  //   disableAndroid: false,
  //   browserSniff: true
  // }));

  app.post('/api/report-violation', function (req, res) {
    res.status(204).end()
  });
}