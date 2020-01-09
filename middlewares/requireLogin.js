import { MessageTypeEnum } from '../client/src/utils/constants';

export default (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        type: MessageTypeEnum.error,
        message: 'You must log in!'
      });
    }

    next();
  } catch (err) {
    throw err;
  }
};
