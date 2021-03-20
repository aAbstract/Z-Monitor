module.exports = (server, db_obj) => {
    server.get('/add_kpi_profile', (req, res) => {
        res.render('pages/create_kpi');
    });
};