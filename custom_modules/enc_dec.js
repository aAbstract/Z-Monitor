const crypto_js = require('crypto-js');

const server_hmac_key = '5nJNqz7KK8chRZ4pmVYjikw75i5sR1hs933jHzj8NaXbYwL54OBELCdYhfT5tZZS';

module.exports = {
    get_hmac_hash: (in_data) => {
        return crypto_js.HmacSHA256(in_data, server_hmac_key);
    },
    get_hash_salt: (salt_len) => {
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let out_arr = Array(salt_len).fill(0);
        for (let i = 0; i < salt_len; i++) {
            out_arr[i] = letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return out_arr.join('');
    }
};