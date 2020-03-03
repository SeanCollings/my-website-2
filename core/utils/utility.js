export const extractUserDetails = user => {
  if (!user) return null;

  if (!!user.tempUser) {
    const { givenName, familyName, _id } = user;

    return {
      givenName,
      familyName,
      tempUser: true,
      _id
    };
  }

  const extractUser = !!user._doc ? { ...user._doc } : { ...user };
  const {
    splashes,
    superUser,
    pererittoUser,
    pereryvUser,
    allowNotifications,
    givenName,
    familyName,
    emailAddress,
    googlePhoto,
    uploadedPhoto,
    _id
  } = extractUser;

  return {
    splashes,
    superUser,
    pererittoUser,
    pereryvUser,
    allowNotifications,
    givenName,
    familyName,
    emailAddress,
    googlePhoto,
    uploadedPhoto,
    _id
  };
};
