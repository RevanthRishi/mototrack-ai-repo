export const Routes = {
  tabs: '/(tabs)',
  fuel: '/(tabs)/fuel',
  service: '/(tabs)/service',
  profile: '/(tabs)/profile',
  aiMechanic: '/(tabs)/ai-mechanic',
  vehicleDetail: (id: string) => `/vehicle/${id}`,
  vehicleAdd: '/vehicle/add',
  vehicleEdit: (id: string) => `/vehicle/edit/${id}`,
  login: '/(auth)/login',
  register: '/(auth)/register',
  onboarding: '/(auth)/onboarding',
  forgotPassword: '/(auth)/forgot-password',
} as const;
