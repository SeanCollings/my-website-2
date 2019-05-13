export default (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({
      type: MessageTypeEnum.error,
      message: 'You must log in!'
    });
  }

  next();
};
