const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getEntries', mid.requiresLogin, controllers.Entry.getEntries);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/pass', mid.requiresSecure, mid.requiresLogin, controllers.Account.passChange);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Entry.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Entry.make);
  app.delete('/deleteEntry', mid.requiresLogin, controllers.Entry.deleteEntry);
  app.put('/updateEntry', mid.requiresLogin, controllers.Entry.updateEntry);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Account.errorPage);
};

module.exports = router;
