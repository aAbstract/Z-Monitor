const sec_manager = require('../custom_modules/security');

module.exports = (server, db_obj) => {
    server.get('/', (req, res) => {
        const cookie = req.headers.cookie;
        if (typeof cookie === 'undefined') {
            res.redirect('/login');
        }
        const sessid = cookie.split('=')[1];
        const user_name = sec_manager.validate_cookie(sessid);
        if (user_name !== 'none') {
            res.render('pages/main', { user_name_val: user_name });
        } else {
        }
    });
};