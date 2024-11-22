import React, { useState } from "react";

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

interface FieldState {
  value: string;
  valid: boolean;
  touched: boolean;
  validators: Function[]
}

interface SignupFormState {
  email: FieldState;
  password: FieldState;
  name: FieldState;
  formIsValid: boolean;
}

interface SignupProps {
  onSignup: (event: React.FormEvent, formState: SignupFormState) => void;
  loading: boolean;
}

const Signup: React.FC<SignupProps> = ({ onSignup, loading }) => {
  const [signupForm, setSignupForm] = useState<SignupFormState>({
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
    name: {
      value: "",
      valid: false,
      touched: false,
      validators: [required],
    },
    formIsValid: false,
  });

  const inputChangeHandler = (input: keyof SignupFormState, value: string) => {
    setSignupForm((prevState: SignupFormState) => {
      const updatedField = prevState[input] as FieldState;
      let isValid = true;
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

      let formIsValid = true;
      for (const inputName in updatedForm) {
        if (inputName !== 'formIsValid') {
          const field = updatedForm[inputName as keyof SignupFormState] as FieldState;
          if ('valid' in field) {
            formIsValid =
              formIsValid && field.valid;
          }
        }
      }

      return {
        ...updatedForm,
        formIsValid,
      };
    });
  };

  const inputBlurHandler = (input: keyof SignupFormState) => {
    setSignupForm((prevState: SignupFormState) => ({
      ...prevState,
      [input]: {
        ...prevState[input] as FieldState,
        touched: true,
      },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSignup(event, signupForm);
  };

  return (
    <Auth>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={(event: any) => inputChangeHandler("email", event.target.value)}
          onBlur={() => inputBlurHandler("email")}
          value={signupForm.email.value}
          valid={signupForm.email.valid}
          touched={signupForm.email.touched}
        />
        <Input
          id="name"
          label="Your Name"
          type="text"
          control="input"
          onChange={(event: any) => inputChangeHandler("name", event.target.value)}
          onBlur={() => inputBlurHandler("name")}
          value={signupForm.name.value}
          valid={signupForm.name.valid}
          touched={signupForm.name.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={(event: any) => inputChangeHandler("password", event.target.value)}
          onBlur={() => inputBlurHandler("password")}
          value={signupForm.password.value}
          valid={signupForm.password.valid}
          touched={signupForm.password.touched}
        />
        <Button design="raised" type="submit" loading={loading}>
          Signup
        </Button>
      </form>
    </Auth>
  );
};

export default Signup;

// class Signup extends Component {
//   state = {
//     signupForm: {
//       email: {
//         value: '',
//         valid: false,
//         touched: false,
//         validators: [required, email]
//       },
//       password: {
//         value: '',
//         valid: false,
//         touched: false,
//         validators: [required, length({ min: 5 })]
//       },
//       name: {
//         value: '',
//         valid: false,
//         touched: false,
//         validators: [required]
//       },
//       formIsValid: false
//     }
//   };

//   inputChangeHandler = (input, value) => {
//     this.setState(prevState => {
//       let isValid = true;
//       for (const validator of prevState.signupForm[input].validators) {
//         isValid = isValid && validator(value);
//       }
//       const updatedForm = {
//         ...prevState.signupForm,
//         [input]: {
//           ...prevState.signupForm[input],
//           valid: isValid,
//           value: value
//         }
//       };
//       let formIsValid = true;
//       for (const inputName in updatedForm) {
//         formIsValid = formIsValid && updatedForm[inputName].valid;
//       }
//       return {
//         signupForm: updatedForm,
//         formIsValid: formIsValid
//       };
//     });
//   };

//   inputBlurHandler = input => {
//     this.setState(prevState => {
//       return {
//         signupForm: {
//           ...prevState.signupForm,
//           [input]: {
//             ...prevState.signupForm[input],
//             touched: true
//           }
//         }
//       };
//     });
//   };

//   render() {
//     return (
//       <Auth>
//         <form onSubmit={e => this.props.onSignup(e, this.state)}>
//           <Input
//             id="email"
//             label="Your E-Mail"
//             type="email"
//             control="input"
//             onChange={this.inputChangeHandler}
//             onBlur={this.inputBlurHandler.bind(this, 'email')}
//             value={this.state.signupForm['email'].value}
//             valid={this.state.signupForm['email'].valid}
//             touched={this.state.signupForm['email'].touched}
//           />
//           <Input
//             id="name"
//             label="Your Name"
//             type="text"
//             control="input"
//             onChange={this.inputChangeHandler}
//             onBlur={this.inputBlurHandler.bind(this, 'name')}
//             value={this.state.signupForm['name'].value}
//             valid={this.state.signupForm['name'].valid}
//             touched={this.state.signupForm['name'].touched}
//           />
//           <Input
//             id="password"
//             label="Password"
//             type="password"
//             control="input"
//             onChange={this.inputChangeHandler}
//             onBlur={this.inputBlurHandler.bind(this, 'password')}
//             value={this.state.signupForm['password'].value}
//             valid={this.state.signupForm['password'].valid}
//             touched={this.state.signupForm['password'].touched}
//           />
//           <Button design="raised" type="submit" loading={this.props.loading}>
//             Signup
//           </Button>
//         </form>
//       </Auth>
//     );
//   }
// }

// export default Signup;
