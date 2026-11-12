const { json, setCookie } = require('./_lib');
module.exports = async (req, res) => { setCookie(res, '', 0); json(res, 200, { ok: true }) };
