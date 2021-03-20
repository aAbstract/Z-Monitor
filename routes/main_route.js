const sec_manager = require('../custom_modules/security');
const encr_module = require('../custom_modules/enc_dec');

module.exports = (server, db_obj) => {
    // api debug route
    server.post('/', async (req, res) => {
        const _api_key = req.body.api_key;
        const _api_id = req.body.api_id;
        db_obj.all(`
        SELECT api_key_hash FROM public_apis
        WHERE ID = ?;
        `, [_api_id], (err, record) => {
            if (err)
                res.send('public api key validation error');
            const in_key_hash = String(encr_module.get_hmac_hash(_api_key));
            const is_valid_api_key = (in_key_hash === record[0]['api_key_hash']);
            const out_msg = is_valid_api_key ? 'valid api key' : 'invalid api key';
            res.send(out_msg);
        });
    });
    server.get('/', (req, res) => {
        const cookie = req.headers.cookie;
        if (typeof cookie === 'undefined') {
            res.redirect('/login');
            return;
        }
        const sessid = cookie.split('=')[1];
        const user_name = sec_manager.validate_cookie(sessid);
        if (user_name !== 'none') {
            res.render('pages/main', { user_name_val: user_name });
        } else {
            res.redirect('/login');
        }
    });
};