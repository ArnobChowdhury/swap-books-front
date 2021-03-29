import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export const emailTransporter = nodemailer.createTransport({
  host: 'mail.pustokio.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ID, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
  },
});

const layoutsDir = path.join(__dirname, '..', 'views', 'layouts');
const viewPath = path.join(__dirname, '..', 'views');

const options = {
  viewEngine: {
    extname: '.handlebars',
    layoutsDir,
    defaultLayout: 'main',
  },
  viewPath,
  extName: '.handlebars',
};

emailTransporter.use('compile', hbs(options));
