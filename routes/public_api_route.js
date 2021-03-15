module.exports = (server, db_obj) => {
    server.post('/api/public/:api_id', (req, res) => {
        const _api_id = req.params.api_id; // public api id
        // EHAB-TODO: public api logic
    });
};