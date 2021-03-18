const sec_manager = require('../custom_modules/security');
const encr_module = require('../custom_modules/enc_dec');

const debug = true;

module.exports = (server, db_obj) => {
    server.post('/api/private/auth', (req, res) => {
        const _api_action = req.body.api_action;
        switch (_api_action) {
            case 'signup': {
                const _user_name = req.body.user_name;
                db_obj.all(`
                SELECT user_name FROM users
                WHERE user_name = ?;
                `, [_user_name], (err, record) => {
                    if (err && debug)
                        console.log(err.message);
                    if (record.length != 0) {
                        res.json({
                            auth_api_msg: 'duplicate user name'
                        });
                    }
                });
                const _user_pass = req.body.user_pass;
                const pass_hash = String(encr_module.get_hmac_hash(_user_pass));
                const _email = req.body.email;
                db_obj.run(`
                INSERT INTO users (user_name, pass_hash, email)
                VALUES (?, ?, ?);
                    `, [_user_name, pass_hash, _email], (err) => {
                    if (err && debug) {
                        console.log(`[ERROR]: ${err.message}`);
                    } else {
                        res.json({
                            sessid: sec_manager.generate_secure_cookie(_user_name)
                        });
                    }
                });
                break;
            } // end signup case
            case 'login': {
                const _user_name = req.body.user_name;
                db_obj.all(`
                SELECT pass_hash FROM users
                WHERE user_name = ?;
                `, [_user_name], (err, record) => {
                    if (err) {
                        if (debug)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json({
                            sessid: 'none'
                        });
                        return;
                    }
                    if (record.length != 0) {
                        const _user_pass = req.body.user_pass;
                        const pass_hash = String(encr_module.get_hmac_hash(_user_pass));
                        if (record[0]['pass_hash'] === pass_hash) {
                            res.json({
                                sessid: sec_manager.generate_secure_cookie(_user_name)
                            });
                        } else {
                            res.json({
                                sessid: 'none'
                            });
                        }
                    } else {
                        res.json({
                            sessid: 'none'
                        });
                    }
                });
                break;
            } // end login case
        } // end api_method switch
    });
};