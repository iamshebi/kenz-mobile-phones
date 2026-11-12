const { json, authed, configured, ENV } = require('./_lib');
module.exports = async (req, res) => {
  const c = configured();
  const who = authed(req);
  json(res, 200, { authed: !!who, setup: c, email: who || null });
};
