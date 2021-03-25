const sec_manager = require('../custom_modules/security');
const sql_string = require('sqlstring');

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
                    db_obj.run(`
                    SELECT ID,name
                    FROM public_apis
                    INNER JOIN users ON public_apis.uid=users.ID
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
                    SELECT ${_label_col} AS data_label, SUM(${_aggr_col}) AS aggr_val FROM ${_data_source}
                    GROUP BY ${_label_col}
                    ORDER BY aggr_val DESC;
                    `, [], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json(record);
                    });
                    break;
                }
                case 'kpi_avg': {
                    const _avg_eq = sql_string.escape(req.body.avg_eq).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT AVG(${_avg_eq}) AS output FROM ${_data_source};
                    `, [], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json(record[0]);
                    });
                    break;
                }
                case 'kpi_total': {
                    const _tot_col = sql_string.escape(req.body.tot_col).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT SUM(${_tot_col}) AS output FROM ${_data_source};
                    `, [], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json(record[0]);
                    });
                    break;
                }
                case 'kpi_vstate': {
                    const _target_field = sql_string.escape(req.body.target_field).substring(1).slice(0, -1);
                    const _data_source = sql_string.escape(req.body.data_source).substring(1).slice(0, -1);
                    const _mes_eq = sql_string.escape(req.body.mes_eq).substring(1).slice(0, -1);
                    db_obj.all(`
                    SELECT ${_target_field} AS target, SUM(${_mes_eq}) AS mes_val FROM ${_data_source}
                    GROUP BY ${_target_field};
                    `, [], (err, record) => {
                        if (err)
                            console.log(`[ERROR]: ${err.message}`);
                        res.json(record);
                    });
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
                    db_obj.run(`
                    INSERT INTO public_apis (uid, info, api_key_hash,name)
                    VALUES(SELECT ID from users where user_name='?',?,?,?);`,
                        [user_name, args.api_info, args.api_api_key_hash, args.api_name], (err, record) => {
                            if (err) {
                                console.log(`[ERROR]: ${err.message}`);
                            } else {
                                res.json({ success: 'private_api_message' });
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
                            res.json({ 'private_api_message': 'faild' });
                        } else {
                            res.json({ 'private_api_message': 'success' });
                        }
                    });
                    break;
                }
                case 'dwhs': {
                    const table_name = args.api_name
                    let query = ``;
                    query1 = `CREATE TABLE IF NOT EXISTS ` + `?` + ` ( "ID"	INTEGER NOT NULL UNIQUE,`;
                    query2 = `INSERT INTO ` + `?` + ` (`;
                    query3 = ` VALUES(select ID FROM users where user_name=?,`;
                    var data = [table_name, user_name, table_name, table_name, table_name, user_name];
                    values = args.values;
                    datatypes = args.datatypes;
                    for (value in values) {
                        data.push(values[value]);
                        query1 += ` ` + `"` + value + `" ` + datatypes[value].toUpperCase() + `,`;
                        query2 += ` ` + value + `,`
                        query3 += ` ?,`;
                    };
                    query1 += ` PRIMARY KEY("ID" AUTOINCREMENT); ` + query2.slice(0, -1) + ` )` + query3.slice(0, -1) + ` );`;
                    db_obj.run(`
                    INSERT INTO dwhs (name)
                    VALUES (?);
                    INSERT INTO users_dwhs (uid,wid)
                    VALUES ((select ID FROM users where user_name=?),(SELECT ID FROM dwhs where name=?));
                    `+ query1, data, (err, record) => {
                        if (err) {
                            console.log(`[ERROR]: ${err.message}`);
                        } else {
                            res.json({ success: 'private_api_message' });
                        }
                    });
                    break;
                }
            }
        }
    });
};