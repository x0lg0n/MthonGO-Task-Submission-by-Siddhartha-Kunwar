const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    next();
  };
  
module.exports = auth;