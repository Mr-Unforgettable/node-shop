import React, { useState } from "react";

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

// Types for form fields
interface FormField {
  value: string;
  valid: boolean;
  touched: boolean;
  validators: Array<(value: string) => boolean>;
}

interface LoginForm {
  email: FormField;
  password: FormField;
  formIsValid: boolean;
}

interface LoginProps {
  onLogin: (
    event: React.FormEvent,
    credentials: { email: string; password: string }
  ) => void;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
    formIsValid: false,
  });

  // Handler for input changes
  const inputChangeHandler = (input: keyof LoginForm, value: string) => {
    setLoginForm((prevState: LoginForm) => {
      const updatedField = prevState[input] as FormField;

      let isValid = true;
      // Check all validators for this input
      for (const validator of updatedField.validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevState,
        [input]: {
          ...updatedField,
          valid: isValid,
          value: value,
        },
      };

      // Check if the entire form is valid
      let formIsValid = true;
      for (const inputName in updatedForm) {
        if (inputName !== 'formIsValid') {
          const field = updatedForm[inputName as keyof LoginForm] as FormField;
          if ('valid' in field) {
            formIsValid =
              formIsValid && field.valid;
          }
        }
      }

      return {
        ...updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  // Handler for input blur event (touched field)
  const inputBlurHandler = (input: keyof LoginForm) => {
    setLoginForm((prevState) => ({
      ...prevState,
      [input]: {
        ...prevState[input] as FormField,
        touched: true,
      },
    }));
  };

  return (
    <Auth>
      <form
        onSubmit={(e) =>
          onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value,
          })
        }
      >
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={(event: any) =>
            inputChangeHandler("email", event.target.value)
          }
          onBlur={() => inputBlurHandler("email")}
          value={loginForm.email.value}
          valid={loginForm.email.valid}
          touched={loginForm.email.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={(event: any) =>
            inputChangeHandler("password", event.target.value)
          }
          onBlur={() => inputBlurHandler("password")}
          value={loginForm.password.value}
          valid={loginForm.password.valid}
          touched={loginForm.password.touched}
        />
        <Button design="raised" type="submit" loading={loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
