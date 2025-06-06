export type RootStackParamList = {
  Main: undefined;
  Auth: {
    setAuth: (value: boolean) => void;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Tools: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: {
    setAuth: (value: boolean) => void;
  };
  Register: undefined;
  ForgotPassword: undefined;
}; 