module.exports = (server, db_obj) => {
    server.get('/index', (req, res) => {
        res.render('pages/index');
    });
};