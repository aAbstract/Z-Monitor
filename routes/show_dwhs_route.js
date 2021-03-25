module.exports = (server, db_obj) => {
    server.get('/preview_dwhs', (req, res) => {
        res.render('pages/show_dwhs');
    });
};