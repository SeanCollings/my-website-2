export default (req, res, next) => {
  if (!req.user.superUser) {
    return res.status(401).send({
      type: MessageTypeEnum.error,
      message: 'Access denied!'
    });
  }

  next();
};
