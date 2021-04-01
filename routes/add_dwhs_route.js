module.exports = (server, db_obj) => {
    server.get('/add_dwhs', (req, res) => {
        res.render('pages/add_dwhs');
    });
};