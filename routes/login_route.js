module.exports = (server, db_obj) => {
    server.get('/login', (req, res) => {
        res.render('pages/login');
    });
};