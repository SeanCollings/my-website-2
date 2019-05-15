import { MessageTypeEnum } from '../client/src/utils/constants';

export default (req, res, next) => {
  if (!req.user.superUser) {
    return res.send({
      type: MessageTypeEnum.error,
      message: 'Access denied!'
    });
  }

  next();
};
