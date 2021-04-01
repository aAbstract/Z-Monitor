const enc_dec = require('../custom_modules/enc_dec');
const sql_string = require('sqlstring');

module.exports = (server, db_obj) => {
    server.post('/api/public/:api_id/:api_key', (req, res) => {
        const _api_id = req.params.api_id;
        const _api_key = req.params.api_key;
        db_obj.all(`
        SELECT api_key_hash FROM public_apis WHERE ID = ?;
        `, [_api_id], (err, record) => {
            if (err) {
                res.json({ public_api_message: 'API ID found' });
            } else {
                const api_key_hash = record[0].api_key_hash;
                if (api_key_hash === String(enc_dec.get_hmac_hash(_api_key))) {
                    db_obj.all(`
                    SELECT info FROM public_apis WHERE ID = ?;
                    `, [_api_id], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                            res.json({ public_api_message: 'Error Fetching API data' });
                        } else {
                            const api_info_obj = JSON.parse(record[0].info);
                            const safe_table_name = sql_string.escape(api_info_obj.dwhs).substring(1).slice(0, -1);
                            db_obj.all(`
                            SELECT * FROM ${safe_table_name};
                            `, (err, record) => {
                                if (err) {
                                    console.log(`[ERROR]: ${err.message}`);
                                    res.json({ public_api_message: 'Error Fetching API data' });
                                } else {
                                    res.json(record);
                                }
                            });
                        }
                    });
                } else {
                    res.json({ public_api_message: 'Access Denied' });
                }
            }
        });
    });
};