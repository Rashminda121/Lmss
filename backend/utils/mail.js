const nodemailer = require("nodemailer");
require("dotenv").config();

// Reusable function to send styled email
function sendCustomEmail(to, name = "", subject, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rashmindaeducation@gmail.com",
      pass: "dmmn afwg tcbv ysek",
    },
  });

  const mailOptions = {
    from: '"Lumina LMSS" <rashmindaeducation@gmail.com>',
    to: to,
    subject: subject,
    html: `
   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; background: #ffffff; border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); border: 1px solid #e8f2fc; color: #333;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://pgr7kpsmbi.ufs.sh/f/m5Lr0hiWlHuzCfa4WTIirEZPgKz1exvGyQ6Mqu0dtIlULofn" alt="Lumina LMSS Logo" style="width: 100px; height: auto;">
      </div>

      <div style="background: #f5f9ff; border-radius: 10px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #1976d2;">
        <h1 style="font-size: 26px; color: #1565c0; margin: 0 0 8px 0; font-weight: 700; text-align: center;">Welcome to Lumina LMSS</h1>
        <div style="text-align: center; margin-bottom: 5px;">
          <span style="display: inline-block; background: #e3f2fd; color: #0d47a1; padding: 6px 15px; border-radius: 20px; font-size: 15px; font-weight: 600;">Lumina LMSS helps you learn and manage courses easily and effectively, supporting your learning journey with the help of AI assistance.</span>
        </div>
      </div>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 25px; color: #444;">
        Hello${name ? `, ${name}` : ""} <span style="color: #1976d2;">👋</span>,
      </p>

      <div style="background: #f8fafd; border-radius: 8px; padding: 20px; margin-bottom: 30px; border: 1px solid #e1e8f0;">
        <p style="font-size: 16px; line-height: 1.7; margin: 0; color: #444;">
          ${message}
        </p>
      </div>

    <div style="border-top: 1px solid #e1e8f0; padding-top: 20px; margin-top: 30px;">
      <p style="font-size: 16px; margin: 0 0 8px 0;">Best regards,</p>
      <p style="font-size: 18px; font-weight: 600; color: #1565c0; margin: 0;">
        Lumina LMSS - Supporting Your Learning Journey
      </p>
    </div>


      <p style="font-size: 13px; color: #78909c; margin-top: 40px; text-align: center; line-height: 1.5;">
        If you didn't sign up for Lumina LMSS, please ignore this email.<br>
        <span style="font-size: 12px;">© 2025 Lumina LMSS. All rights reserved.</span>
      </p>
    </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    }
    console.log("Email sent:", info.response);
  });
}

module.exports = sendCustomEmail;
