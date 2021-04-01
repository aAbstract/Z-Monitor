const sql_string = require('sqlstring');

const sec_manager = require('../custom_modules/security');
const enc_dec = require('../custom_modules/enc_dec');

function create_sql_field(field_name, data_type) {
    return sql_field = `"${field_name}"	${data_type} NOT NULL`;
}

function get_sql_objects(data_arr, user_name) {
    let sql_objects = [];
    data_arr.forEach((x) => {
        data_obj = [`(SELECT users.ID FROM users WHERE users.user_name = '${user_name}')`];
        Object.keys(x).forEach((key) => {
            if (isNaN(x[key])) {
                data_obj.push(`'${x[key]}'`);
            } else {
                data_obj.push(x[key]);
            }
        });
        sql_objects.push(`(${data_obj.join(',')})`);
    });
    return sql_objects.join(',');
}

function raw_script_kpi_parse(object) {
    let total_parsed = [];
    Object.keys(object).forEach((key) => {
        const safe_key = sql_string.escape(key).substring(1).slice(0, -1);
        const safe_value = sql_string.escape(object[key]).substring(1).slice(0, -1);
        total_parsed.push(`COALESCE(SUM(${safe_value}), 0) AS ${safe_key}`);
    });
    return total_parsed.join(',');
}

function http_out_debug(http_object, http_res_stream) {
    console.log(`[INFO-SYSTEM-RESPONSE]: ${JSON.stringify(http_object, null, '\t')}`);
    http_res_stream.json(http_object);
}

module.exports = (server, db_obj) => {
    server.post('/api/private/data', (req, res) => {
        const _api_method = req.body.api_method;
        if (_api_method === 'get') {
            const sessid = req.body.sess_id;
            const user_name = sec_manager.validate_cookie(sessid);
            if (user_name === 'none') {
                res.send('[ERROR]: Access Denied');
                return;
            }
            const target = req.body.target;
            switch (target) {
                case 'dwhs': {
                    db_obj.all(`
                    SELECT dwhs.name FROM dwhs;
                    `, [], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json(record);
                        }
                    });
                    break;
                }
                case 'users_whs': {
                    db_obj.all(`
                    SELECT dwhs.ID, name FROM dwhs 
                    WHERE dwhs.ID IN (SELECT wid 
                    FROM users_dwhs
                    INNER JOIN users on users.ID = users_dwhs.uid
                    WHERE user_name=?);
                    `, [user_name], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json(record);
                        }
                    });
                    break;
                }
                case 'KPI_profiles': {
                    db_obj.all(`
                    SELECT KPI_profiles.ID,KPI_profiles.name
                    FROM KPI_profiles
                    INNER JOIN users ON KPI_profiles.uid=users.ID
                    WHERE user_name=?;
                    `, [user_name], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json(record);
                        }
                    });
                    break;
                }
                case 'KPI_profile': {
                    const _profile_id = req.body.profile_id;
                    db_obj.all(`
                    SELECT KPI_json
                    FROM KPI_profiles
                    WHERE KPI_profiles.ID=? AND KPI_profiles.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                    `, [_profile_id, user_name], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json(record[0]);
                        }
                    });
                    break;
                }
                case 'public_apis': {
                    db_obj.all(`
                    SELECT public_apis.ID, public_apis.info
                    FROM public_apis
                    INNER JOIN users ON public_apis.uid = users.ID
                    WHERE user_name=?;
                    `, [user_name], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json(record);
                        }
                    });
                    break;
                }
                case 'dwhs_info': {
                    const _dwhs_name = req.body.dwhs_name;
                    const _dwhs_id = req.body.dwhs_id;
                    if (typeof _dwhs_id !== 'undefined') {
                        db_obj.all(`
                    SELECT name FROM PRAGMA_TABLE_INFO((SELECT name FROM dwhs WHERE ID = ?));
                    `, [_dwhs_id], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            res.json(record);
                        });
                    } else if (typeof _dwhs_name !== 'undefined') {
                        db_obj.all(`
                    SELECT name FROM PRAGMA_TABLE_INFO(?);
                    `, [_dwhs_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            res.json(record);
                        });
                    }
                    break;
                }
                case 'dwhs_data': {
                    const _dwhs_name = sql_string.escape(req.body.dwhs_name).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT * FROM ${_dwhs_name} WHERE uid in (SELECT ID FROM users WHERE user_name = ?);
                    `, [user_name], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json(record);
                    });
                    break;
                }
                case 'kpi_ranked': {
                    const _label_col = sql_string.escape(req.body.label_col).substring(1).slice(0, -1);
                    const _aggr_col = sql_string.escape(req.body.aggr_col).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT ${_label_col} AS data_label, COALESCE(SUM(${_aggr_col}), 0) AS aggr_val FROM ${_data_source}
                    WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?)
                    GROUP BY ${_label_col}
                    ORDER BY aggr_val DESC;
                    `, [user_name], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        http_out_debug(record, res);
                    });
                    break;
                }
                case 'kpi_avg': {
                    const _avg_eq = sql_string.escape(req.body.avg_eq).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT COALESCE(ROUND(AVG(${_avg_eq}), 2), 0) AS output FROM ${_data_source}
                    WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                    `, [user_name], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        http_out_debug(record[0], res);
                    });
                    break;
                }
                case 'kpi_stacked_line': {
                    const _kpi_args = JSON.parse(req.body.kpi_args);
                    if (_kpi_args.stock_watch == 'items') {
                        let cache = [];
                        db_obj.all(`
                        SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.item = 'item_0' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                        `, [user_name], (err, record) => {
                            cache.push(record);
                            db_obj.all(`
                            SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.item = 'item_1' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                            `, [user_name], (err, record) => {
                                cache.push(record);
                                db_obj.all(`
                                SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.item = 'item_2' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                                `, [user_name], (err, record) => {
                                    cache.push(record);
                                    http_out_debug(cache, res);
                                });
                            });
                        });
                    }
                    else if (_kpi_args.stock_watch == 'stores') {
                        let cache = [];
                        db_obj.all(`
                        SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.store = 'store_0' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                        `, [user_name], (err, record) => {
                            cache.push(record);
                            db_obj.all(`
                            SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.store = 'store_1' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                            `, [user_name], (err, record) => {
                                cache.push(record);
                                db_obj.all(`
                                SELECT STOCK.Date AS label, STOCK.unit_value AS val FROM STOCK WHERE STOCK.store = 'store_2' AND STOCK.uid in (SELECT users.ID FROM users WHERE users.user_name = ?);
                                `, [user_name], (err, record) => {
                                    cache.push(record);
                                    http_out_debug(cache, res);
                                });
                            });
                        });
                    }
                    break;
                }
                case 'kpi_total': {
                    const _tot_col = sql_string.escape(req.body.tot_col).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    const _kpi_args = JSON.parse(req.body.kpi_args);
                    if (_kpi_args.dwhs == 'POS') {
                        db_obj.all(`
                        SELECT COALESCE(ROUND(SUM(${_tot_col})), 0) AS output FROM ${_data_source}
                        WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                        `, [user_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            http_out_debug(record[0], res);
                        });
                    } else if (_kpi_args.dwhs == 'Fin') {
                        if (_kpi_args.year == '-') {
                            db_obj.all(`
                            SELECT COALESCE(ROUND(SUM(${_tot_col}), 2), 0) AS output FROM ${_data_source}
                            WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                            `, [user_name], (err, record) => {
                                if (err)
                                    console.log(`[ERROR]: ${err.message}`);
                                http_out_debug(record[0], res);
                            });
                        } else {
                            db_obj.all(`
                            SELECT COALESCE(ROUND(SUM(${_tot_col}), 2), 0) AS output FROM ${_data_source} WHERE Year = ?
                            WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                            `, [_kpi_args.year, user_name], (err, record) => {
                                if (err)
                                    console.log(`[ERROR]: ${err.message}`);
                                http_out_debug(record0[0], res);
                            });
                        }
                    } else if (_kpi_args.dwhs == 'STOCK') {
                        db_obj.all(`
                        SELECT COALESCE(ROUND(SUM(${_tot_col}), 2), 0) AS output FROM ${_data_source}
                        WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                        `, [user_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            console.log(`[INFO-SYSTEM-RESPONSE]: ${record}`);
                            res.json(record[0]);
                        });
                    } else {
                        res.json({ private_api_message: 'invalid kpi option' });
                    }
                    break;
                }
                case 'kpi_raw': {
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    const _raw_sc_obj = JSON.parse(req.body.raw_sc);
                    let q = `SELECT
                    ${raw_script_kpi_parse(_raw_sc_obj)}
                    FROM ${_data_source};
                    `;
                    db_obj.all(`
                    SELECT
                    ${raw_script_kpi_parse(_raw_sc_obj)}
                    FROM ${_data_source}
                    WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?);
                    `, [user_name], (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                            res.json({ private_api_message: 'faild' });
                        } else {
                            console.log(`[INFO-SYSTEM-RESPONSE]: ${record}`);
                            http_out_debug(record[0], res);
                        }
                    });
                    break;
                }
                case 'kpi_vstate': {
                    const _target_field = sql_string.escape(req.body.target_field).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    const _mes_eq = sql_string.escape(req.body.mes_eq).substring(1).slice(0, -1);
                    const _kpi_args = JSON.parse(req.body.kpi_args);
                    if (_kpi_args.dwhs == 'POS') {
                        db_obj.all(`
                        SELECT ${_target_field} AS target, COALESCE(SUM(${_mes_eq}), 0) AS mes_val FROM ${_data_source}
                        WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?)
                        GROUP BY ${_target_field};
                        `, [user_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            http_out_debug(record, res);
                        });
                    } else if (_kpi_args.dwhs == 'Fin') {
                        db_obj.all(`
                        SELECT ${_data_source}.${_target_field} AS target, COALESCE(ROUND(SUM(${_mes_eq}), 2), 0) AS mes_val FROM ${_data_source}
                        WHERE (Year = ?) AND (${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?))
                        GROUP BY ${_target_field};
                        `, [_kpi_args.year, user_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            http_out_debug(record, res);
                        });
                    } else if (_kpi_args.dwhs == 'Stock') {

                    } else {
                        db_obj.all(`
                        SELECT ${_target_field} AS target, COALESCE(SUM(${_mes_eq}), 0) AS mes_val FROM ${_data_source}
                        WHERE ${_data_source}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?)
                        GROUP BY ${_target_field};
                        `, [user_name], (err, record) => {
                            if (err)
                                console.log(`[ERROR]: ${err.message}`);
                            http_out_debug(record, res);
                        });
                    }
                    break;
                }
            }
        } else if (_api_method === 'post') {
            const sessid = req.body.sess_id;
            const user_name = sec_manager.validate_cookie(sessid);
            if (user_name === 'none') {
                res.send('[ERROR]: Access Denied');
                return;
            }
            const target = req.body.target;
            switch (target) {
                case 'public_apis': {
                    let _api_info_string = req.body.api_info;
                    console.log(_api_info_string);
                    let api_key = `${user_name}-${enc_dec.get_hash_salt(64)}`;
                    var sql_query = db_obj.prepare(`
                    INSERT INTO public_apis (uid, info, api_key_hash)
                    VALUES((SELECT 
                        ID from users where user_name=?), ?, ?);
                    `);
                    sql_query.run(user_name, _api_info_string, enc_dec.get_hmac_hash(api_key), function (err) {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                            res.json({ private_api_message: 'faild' });
                        } else {
                            res.json({
                                private_api_message: 'success',
                                api_url: `/api/public/${this.lastID}`,
                                api_key: api_key
                            });
                        }
                    });
                    break;
                }
                case 'dwhs_feed': {
                    const _table_name = sql_string.escape(req.body.table_name).substring(1).slice(0, -1);
                    const _table_struct = req.body['table_struct[]'];
                    const safe_user_name = sql_string.escape(user_name).substring(1).slice(0, -1);
                    let struct_sql = sql_string.escape(`(${_table_struct.join(',')})`).slice(1, -1);
                    let data_json_obj = JSON.parse(req.body.data_feed);
                    db_obj.run(`
                    INSERT INTO ${_table_name} ${struct_sql}
                    VALUES
                    ${get_sql_objects(data_json_obj, safe_user_name)}
                    ;
                    `, [], (err) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                            res.json({ private_api_message: 'faild' });
                        } else {
                            res.json({ private_api_message: 'success' });
                        }
                    });
                    break;
                }
                case 'KPI_profiles': {
                    const _kpi_json = req.body.kpi_json;
                    const _name = req.body.name;
                    db_obj.run(`
                    INSERT INTO KPI_profiles (uid, KPI_json,name)
                    VALUES((SELECT ID from users where user_name=?),?,?);
                    `, [user_name, _kpi_json, _name], (err) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                            res.json({ private_api_message: 'faild' });
                        } else {
                            res.json({ private_api_message: 'success' });
                        }
                    });
                    break;
                }
                case 'dwhs': {
                    const _table_name = sql_string.escape(req.body.table_name).substring(1).slice(0, -1);
                    const _dwhs_action = req.body.dwhs_action;
                    if (_dwhs_action == 'create') {
                        const _fields_array = JSON.parse(req.body.fields_array);
                        let sql_params = [
                            '"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE',
                            '"uid"	INTEGER NOT NULL'
                        ];
                        _fields_array.forEach((x) => {
                            const sqlf_name = sql_string.escape(x.field_name).substring(1).slice(0, -1);
                            const sqlf_dt = sql_string.escape(x.sql_data_type).substring(1).slice(0, -1);
                            sql_params.push(create_sql_field(sqlf_name, sqlf_dt));
                        });
                        db_obj.run(`
                        CREATE TABLE "${_table_name}" (
                            ${sql_params.join(',')}
                        );
                        `, [], (err) => {
                            if (err) {
                                console.log(`[ERROR]: ${err.message}`);
                                res.json({ private_api_message: 'faild' });
                            } else {
                                const safe_user_name = sql_string.escape(user_name).substring(1).slice(0, -1);
                                db_obj.run(`
                                INSERT INTO dwhs (name)
                                VALUES ('${_table_name}');
                                `, [], (err) => {
                                    if (err) {
                                        console.log(`[ERROR]: ${err.message}`);
                                        res.json({ private_api_message: 'faild' });
                                    } else {
                                        db_obj.run(`
                                        INSERT INTO users_dwhs (uid, wid)
                                        VALUES ((SELECT users.ID FROM users WHERE user_name = '${safe_user_name}'), (SELECT dwhs.ID FROM dwhs WHERE dwhs.name = '${_table_name}'));
                                        `, [], (err) => {
                                            if (err) {
                                                console.log(`[ERROR]: ${err.message}`);
                                                res.json({ private_api_message: 'faild' });
                                            } else {
                                                res.json({ private_api_message: 'success' });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else if (_dwhs_action == 'use_exist') {
                        db_obj.run(`
                        INSERT INTO users_dwhs (uid, wid)
                        VALUES ((SELECT users.ID FROM users WHERE user_name = ?), (SELECT dwhs.ID FROM dwhs WHERE dwhs.name = ?));
                        `, [user_name, _table_name], (err) => {
                            if (err) {
                                console.log(`[ERROR]: ${err.message}`);
                                res.json({ private_api_message: 'faild' });
                            } else {
                                res.json({ private_api_message: 'success' });
                            }
                        });
                    }
                    else {
                        res.json({ private_api_message: 'invalid dwhs action' });
                    }
                    break;
                }
            }
        } else if (_api_method === 'delete') {
            const sessid = req.body.sess_id;
            const user_name = sec_manager.validate_cookie(sessid);
            if (user_name === 'none') {
                res.send('[ERROR]: Access Denied');
                return;
            }
            const safe_target = sql_string.escape(req.body.target).substring(1).slice(0, -1);
            const safe_id_list_str = sql_string.escape(req.body.id_list).substring(1).slice(0, -1);
            const parsed_id_str = safe_id_list_str.replace('[', '(').replace(']', ')');
            db_obj.run(`
            DELETE FROM ${safe_target}
            WHERE ${safe_target}.uid IN (SELECT users.ID FROM users WHERE users.user_name = ?)
            AND
            ${safe_target}.ID IN ${parsed_id_str}
            `, [user_name], (err) => {
                if (err) {
                    console.log(`[ERROR]: ${err.message}`);
                    res.json({ private_api_message: 'faild' });
                } else {
                    res.json({ private_api_message: 'success' });
                }
            });
        } else {
            res.json({ private_api_message: 'invalid api method' });
        }
    });
};