const date = new Date();
const currentYear = date.getFullYear();
export default {
  // v2Url: 'https://qlvh.gosol.com.vn/api/v2/', // api public
  // v2Url: 'http://192.168.100.45:3082/api/v2/', // api dev
  //   v2Url: 'https://apiqlvbtest.gosol.com.vn/api/v1/', // api dev
  //  v2Url: 'https://displaycms.gosol.com.vn/api/v2/' ,// api dev
  // v2Url: 'https://displaycms.gosol.com.vn/api/v2/',
  v2Url: 'https://unittest.gosol.com.vn/api/v2/',// api dev
};
const siteConfig = {
  siteName: 'SMARTSIGNAGE',
  siteIcon: '', //ion-flash
  footerText: `Copyright © ${currentYear} GO SOLUTIONS. All rights`,

};

const themeConfig = {
  topbar: 'theme6',
  sidebar: 'theme8',
  layout: 'theme2',
  theme: 'themedefault',
};
const language = 'english';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

export { siteConfig, themeConfig, language, firebaseConfig };
