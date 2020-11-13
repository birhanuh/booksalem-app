import * as yup from 'yup';

const phoneRegExp = /^$|^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
// const isLt2M = file.size / 1024 / 1024 < 2;

export const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required"),
  email: yup
    .string()
    .min(3, "Email must be at least 3 characters")
    .max(255)
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(255)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(3, "Confirm Password must be at least 3 characters")
    .max(255)
    .required("Confirm password is required")
    .test('passwords-match', "Passwords don't match", function (value) {
      return this.parent.password === value;
    }),
  phone: yup.string().matches(phoneRegExp, 'Phone number is not valid')
});

export const forgotPasswordResetRequestSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, "Email must be at least 3 characters")
    .max(255)
    .email("Email must be a valid email")
    .required("Email is required")
});

export const passwordResetchema = yup.object().shape({
  password: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(255)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(255)
    .required("Confirm password is required")
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, "Invalid login")
    .max(255, "Invalid login")
    .email("Invalid login")
    .required("Email is required"),
  password: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(255)
    .required("Password is required")
});

export const addBookSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required"),
  author: yup
    .string()
    .required("Author is required"),
  languageId: yup
    .number()
    .required("Language is required"),
  categoryId: yup
    .number()
    .required("Category is required"),
  price: yup
    .number()
    .positive()
    .required("Price is required"),
  status: yup
    .string()
    .required("Status is required"),
  condition: yup
    .string()
    .required("Condition is required"),
  isbn: yup
    .number()
    .required()
    .positive()
    .integer("ISBN is required"),
  publishedDate: yup
    .string(),
  // coverFile: yup
  //   .mixed()
  //   .required("A file is required")
  //   .test(
  //     "fileSize",
  //     "File too large",
  //     value => value && value.size / 1024 < 2
  //   )
});

export const checkoutSchema = yup.object().shape({
  chekcoutType: yup
    .string()
    .required("Checkout type is required"),
  userId: yup
    .number()
    .required("User is required"),
  bookId: yup
    .number()
    .required("Book is required"),
  checkoutDate: yup
    .date()
    .default(() => (new Date())),
  returnDate: yup
    .date()
    .required("Book is required"),
});
