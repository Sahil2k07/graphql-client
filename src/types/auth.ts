// Signin
type SigninInput = {
  email: string;
  password: string;
};

type SigninResponse = {
  signin: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
};

// Signup
type SignupInput = {
  email: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
};
