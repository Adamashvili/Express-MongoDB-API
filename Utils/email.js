const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetURL = `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`;

  const mailOptions = {
    from: `"Phone Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password Reset Request",
    html: `
      <h2>პაროლის აღდგენა</h2>
      <p>პაროლის აღსადგენის კოდია:  <strong> ${resetToken} </strong>  </p>
      <p>კოდი იმუშავებს 10 წუთის განმავლობაში.</p>
      <p>თუ თქვენ არ მოითხოვეთ პაროლის აღდგენა, უგულებელყავით ეს მეილი.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendPasswordResetEmail;