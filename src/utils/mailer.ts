import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
 service: 'gmail',
  port:465, // use 587 for STARTTLS
  secure:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: '"Mpahira" <no-reply@yourapp.com>',
    to: email,
    subject: 'Your One-Time Password (OTP) for Mpahira Verification',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://via.placeholder.com/100x100.png?text=Mpahira" alt="Mpahira Logo" style="border-radius: 10px;" />
          <h2 style="color: #2c3e50; margin-top: 15px;">Verify Your Identity</h2>
        </div>
        
        <p style="font-size: 16px; color: #333;">
          Hi there,
        </p>

        <p style="font-size: 16px; color: #333;">
          To ensure the security of your account, please use the following One-Time Password (OTP) to complete your verification process. This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #f9f9f9; padding: 18px 40px; font-size: 28px; font-weight: bold; color: #2d3748; letter-spacing: 5px; border-radius: 8px; border: 1px dashed #ccc; user-select: all;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 16px; color: #333;">
          Just copy and paste the code above into the verification screen. If you didn’t request this, it’s safe to ignore this email — no changes will be made to your account.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

        <p style="font-size: 14px; color: #777;">
          For your security, never share this code with anyone. Mpahira will never ask you for your OTP or password.
        </p>

        <p style="font-size: 14px; color: #777;">
          Need help? Contact our support team at <a href="mailto:support@mpahira.com" style="color: #4a90e2;">support@mpahira.com</a>.
        </p>

        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          Thanks,<br />
          <strong>The Mpahira Team</strong>
        </p>
      </div>
    `,
  });
};

