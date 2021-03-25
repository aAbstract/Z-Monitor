module.exports = (server, db_obj) => {
    server.get('/show_kpi_profile', (req, res) => {
        res.render('pages/show_kpi');
    });
};