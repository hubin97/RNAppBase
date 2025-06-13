export type RootStackParamList = {
  Main: undefined;
  Auth: {
    setAuth: (value: boolean) => void;
  };
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tools: undefined;
  Discover: undefined;
  Mine: undefined;
};

export type AuthStackParamList = {
  Login: {
    setAuth: (value: boolean) => void;
  };
  Register: undefined;
  ForgotPassword: undefined;
}; 