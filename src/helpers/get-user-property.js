const getProperty = (user, propKey) => {
    if (!user) {
        return 'Undefined user';
    }

    if (!user.userProperties) {
        return null;
    }

    const property = user
    .userProperties
    .find(_ => _.propKey === propKey)

    if (!property) {
        return false;
    }

    return property.propValue;
};

export default getProperty;
