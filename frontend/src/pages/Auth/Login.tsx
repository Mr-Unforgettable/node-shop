import React, { useState } from 'react';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

interface LoginProps {
    onLogin: (event: React.FormEvent, authData: { email: string; password: string }) => void;
    loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
    const [loginForm, setLoginForm] = useState({
        email: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, email],
        },
        password: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, length({ min: 5 })],
        },
        formIsValid: false,
    });

    // Input change handler
    const inputChangeHandler = (input: string, value: string) => {
        setLoginForm((prevState) => {
            let isValid = true;
            // Validate the input value
            for (const validator of prevState[input].validators) {
                isValid = isValid && validator(value);
            }

            const updatedForm = {
                ...prevState,
                [input]: {
                    ...prevState[input],
                    valid: isValid,
                    value: value,
                },
            };

            // Check if the entire form is valid
            let formIsValid = true;
            for (const inputName in updatedForm) {
                if (inputName !== 'formIsValid') {
                    formIsValid = formIsValid && updatedForm[inputName].valid;
                }
            }

            return {
                loginForm: updatedForm,
                formIsValid: formIsValid,
            };
        });
    };

    // Input blur handler
    const inputBlurHandler = (input: string) => {
        setLoginForm((prevState) => ({
            loginForm: {
                ...prevState.loginForm,
                [input]: {
                    ...prevState.loginForm[input],
                    touched: true,
                },
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
                    onChange={(event) => inputChangeHandler('email', event.target.value)}
                    onBlur={() => inputBlurHandler('email')}
                    value={loginForm.email.value}
                    valid={loginForm.email.valid}
                    touched={loginForm.email.touched}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    control="input"
                    onChange={(event) => inputChangeHandler('password', event.target.value)}
                    onBlur={() => inputBlurHandler('password')}
                    value={loginForm.password.value}
                    valid={loginForm.password.valid}
                    touched={loginForm.password.touched}
                />
                <Button design="raised" type="submit" loading={loading} disabled={!loginForm.formIsValid}>
                    Login
                </Button>
            </form>
        </Auth>
    );
};

export default Login;
