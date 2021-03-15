module.exports = (server, db_obj) => {
    server.get('/', (req, res) => {
        res.render('pages/main');
    });  
};