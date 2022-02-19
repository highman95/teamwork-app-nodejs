module.exports.isValidEmail = (email) => (email && /^([a-zA-Z0-9_\-]+)(\.)?([a-zA-Z0-9_\-]+)@([a-zA-Z]+)\.([a-zA-Z]{2,})$/.test(email));// eslint-disable-line no-useless-escape

module.exports.validateParameters = (submissions, params) => {
  Object.entries(submissions).map(([key, value]) => {
    if (!params.includes(key)) throw new Error(`Invalid Parameter - ${key} - supplied`); // 400
    if (!value || !value.trim()) throw new Error(`${key.charAt(0).toUpperCase().concat(key.substring(1))} cannot be empty (required)`); // 400
    return { [key]: value };
  });
};
