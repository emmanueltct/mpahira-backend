export interface UserAttributes {
  id: string;
  firstName: string;
  lastName:string;
  telephone:string;
  email: string;
  password?: string;
  profilePic?: string;
  provider: 'local' | 'google';
  roleId: string;
  otp?:string;
  otpExpires?:Date;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
