import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER, LOGIN_USER } from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';
import { User, AuthPayload } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Flag } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const [createUser, { loading: createLoading, error: createError }] = 
    useMutation<{ createUser: User }>(CREATE_USER);
  
  const [loginUser, { loading: loginLoading }] = 
    useMutation<{ loginUser: AuthPayload }>(LOGIN_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // First name validation
    if (!formData.firstname) {
      errors.firstname = 'First name is required';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastname) {
      errors.lastname = 'Last name is required';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Create user
      const { data: createData } = await createUser({
        variables: {
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
        },
      });

      if (createData?.createUser) {
        // Login after successful signup
        const { data: loginData } = await loginUser({
          variables: { email: formData.email, password: formData.password },
        });

        if (loginData?.loginUser) {
          login(loginData.loginUser.token, loginData.loginUser.user);
          navigate('/home');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Flag size={40} className="text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-racing font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-accent-400">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 bg-accent-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-accent-800">
          {createError && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md text-red-500">
              {createError.message.includes('duplicate key') 
                ? 'This email is already registered' 
                : createError.message}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <Input
                id="firstname"
                name="firstname"
                type="text"
                label="First name"
                value={formData.firstname}
                onChange={handleChange}
                error={formErrors.firstname}
                fullWidth
              />

              <Input
                id="lastname"
                name="lastname"
                type="text"
                label="Last name"
                value={formData.lastname}
                onChange={handleChange}
                error={formErrors.lastname}
                fullWidth
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              fullWidth
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              fullWidth
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={createLoading || loginLoading}
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;