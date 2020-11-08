import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
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

// if (data.password && data.confirmPassword) {
//   if (data.password !== data.confirmPassword) {
//     errors["password"] = "Password and confirm password does not match";
//     errors["confirmPassword"] = T.translate(
//       "Password and confirm password does not match"
//     );
//   }
// }

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

export const checkoutAddressSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required"),
  author: yup
    .string()
    .required("Author is required"),
  language: yup
    .string()
    .required("Language is required"),
  category: yup
    .string()
    .required("Category is required"),
  price: yup
    .string()
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
    .date()
    .default(() => (new Date()))
});

