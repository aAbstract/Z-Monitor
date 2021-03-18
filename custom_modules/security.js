const encr_module = require('./enc_dec');

module.exports = {
    generate_secure_cookie: (in_data) => {
        const start_point = Math.floor(in_data.length / 2);
        const salt = encr_module.get_hash_salt(5);
        salted_data = salt.slice(0, 2) + in_data.slice(0, start_point) + salt[2] + in_data.slice(start_point, in_data.length) + salt.slice(3, salt.length);
        return `${in_data}|${salt.slice(0, 3) + encr_module.get_hmac_hash(salted_data) + salt.slice(3, salt.length)}`;
    },
    validate_cookie: (cookie) => {
        try {
            const phase1 = cookie.split('|');
            const user_name = phase1[0];
            const salt = phase1[1].slice(0, 3) + phase1[1].slice(-2, phase1[1].length);
            const start_point = Math.floor(user_name.length / 2);
            const salted_data = salt.slice(0, 2) + user_name.slice(0, start_point) + salt[2] + user_name.slice(start_point, user_name.length) + salt.slice(3, salt.length);
            const in_hmac_hash = phase1[1].slice(3, -2);
            if (String(encr_module.get_hmac_hash(salted_data)) === in_hmac_hash) {
                return user_name;
            } else {
                return 'none';
            }
        } catch (err) {
            return 'none';
        }
    },
    validate_public_api_key: (api_key, api_id, db_obj) => {
        // note: use this function copy not call
        db_obj.all(`
        SELECT api_key_hash FROM public_apis
        WHERE ID = ?;
        `, [api_id], (err, record) => {
            if (err)
                return false;
            const in_key_hash = String(encr_module.get_hmac_hash(api_key));
            return (in_key_hash === record[0]['api_key_hash']);
        });
    }
};