const sec_manager = require('../custom_modules/security');
const encr_module = require('../custom_modules/enc_dec');

module.exports = (server, db_obj) => {
    server.post('/api/private/data', (req, res) => {
        // EHAB-TODO: private api logic
        const sessid=req.body.sess_id;
        const user_name=sec_manager.validate_cookie(sessid);
        const target = req.body.target;
        const args=req.body.args;
        switch(target)
        {

            case 'public_apis': {
               db_obj.run(`
               INSERT INTO public_apis (uid, info, api_key_hash,name)
               VALUES(SELECT ID from users where user_name='?',?,?,?);`,
               [user_name,args.api_info,args.api_api_key_hash,args.api_name]),(err,record)=>{
                   if(err){
                    console.log(`[ERROR]: ${err.message}`);
                   }else{
                    res.json({success: 'private_api_message'});
                         }
               }
            }

            case 'KPI_profiles': {
                db_obj.run(`
                INSERT INTO KPI_profiles (uid, KPI_json,name)
                VALUES(SELECT ID from users where user_name='?',?,?);`,
                [user_name,args.api_KPI_json,args.api_name]),(err,record)=>{
                    if(err){
                     console.log(`[ERROR]: ${err.message}`);
                    }else{
                     res.json({success: 'private_api_message'});
                          }
                }
             }

             case'dwhs': {
                const table_name=args.api_name
                let query=``;
                query1=`CREATE TABLE IF NOT EXISTS ` + `?` + ` ( "ID"	INTEGER NOT NULL UNIQUE,`;
                query2=`INSERT INTO `+`?`+` (`;
                query3=` VALUES(select ID FROM users where user_name=?,`;
                var data=[table_name,user_name,table_name,table_name,table_name,user_name];
                values=args.values;
                datatypes=args.datatypes;
                for (value in values){
                    data.push(values[value]);
                    query1+=` `+`"`+value+`" `+datatypes[value].toUpperCase()+`,`;
                    query2+=` `+value+`,`
                    query3+=` ?,`;
                };
                query1+=` PRIMARY KEY("ID" AUTOINCREMENT); `+query2.slice(0, -1)+` )`+query3.slice(0, -1)+` );`;
                db_obj.run(`
                INSERT INTO dwhs (name)
                VALUES (?);
                INSERT INTO users_dwhs (uid,wid)
                VALUES ((select ID FROM users where user_name=?),(SELECT ID FROM dwhs where name=?));
                 `+query1,data),(err,record)=>{
                    if(err){
                     console.log(`[ERROR]: ${err.message}`);
                    }else{
                     res.json({success: 'private_api_message'});
                          }
                } 
             }
        }

    });

    server.get('/api/private/data',(req, res) => {
    const sessid=req.body.sess_id;
    const user_name=sec_manager.validate_cookie(sessid);
    const target = req.body.target;

    switch(target){

        case 'users_whs': {
            db_obj.run(`
            SELECT name FROM dwhs 
            WHERE ID IN (SELECT wid 
            FROM users_dwhs
            INNER JOIN users on users.ID=users_dwhs.uid
            WHERE user_name=?);
            `, [user_name], (err, record) => {
                if (err) {
                    console.log(`[ERROR]: ${err.message}`);
                } else {
                    res.json(record);
                }
            });  
        }

        case 'KPI_profiles':{
            db_obj.run(`
            SELECT ID,name
            FROM KPI_profiles
            INNER JOIN users ON KPI_profiles.uid=users.ID
            WHERE user_name=?;
            `,[user_name],(err, record) =>{
                if (err) {
                    console.log(`[ERROR]: ${err.message}`);
                } else {
                    res.json(record);
                }
            });  
        }

        case 'KPI_profile':{
            const id=user_name;
            db_obj.run(`
            SELECT KPI_json
            FROM KPI_profiles
            WHERE ID=?;
            `,[id],(err, record) =>{
                if (err) {
                    console.log(`[ERROR]: ${err.message}`);
                } else {
                    res.json(record);
                }
            });    
        }

        case 'public_apis':{
            db_obj.run(`
            SELECT ID,name
            FROM public_apis
            INNER JOIN users ON public_apis.uid=users.ID
            WHERE user_name=?;
            `,[user_name],(err, record) =>{
                if (err) {
                    console.log(`[ERROR]: ${err.message}`);
                } else {
                    res.json(record);
                }
            });   
        }

    }

    });

};