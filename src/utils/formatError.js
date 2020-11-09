export const formatServerErrors = (errors) => {
  const errMap = {};

  errMap[errors.path] = errors.message;

  return errMap;
};

export const formatYupErrors = (errors) => {
  const formatedErrors = {};

  errors.inner.forEach((err) => {
    formatedErrors[err.path] = err.message
  });

  return formatedErrors;
};