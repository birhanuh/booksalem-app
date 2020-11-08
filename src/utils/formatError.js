export const normalizeErrors = (errors) => {
  const errMap = {};

  errMap[errors.path] = errors.message;

  return { errMap };
};

export const formatYupError = (err) => {
  const errors = {};
  err.inner.forEach((e) => {
    errors[e.path] = e.message
  });

  return errors;
};