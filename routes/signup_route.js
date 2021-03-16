module.exports = (server, db_obj) => {
    server.get('/signup', (req, res) => {
        res.render('pages/signup');
    });
};