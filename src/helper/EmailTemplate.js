import nodemailer from "nodemailer";

export const SendEmail = async (useremail, verifyCode) => {
  try {
    const auth = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "rudranarayanratha78@gmail.com",
        pass: "esdm hjyz vtfy jqor", // Use an App-specific password for better security
      },
    });

    const receiver = {
      from: "rudranarayanratha78@gmail.com",
      to: useremail, // ensure this value is properly passed
      subject: "Here is your verification code",
      text: `Your verification code is: ${verifyCode}`, // Make the message more descriptive
    };

    await auth.sendMail(receiver);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.log("Something went wrong while sending email", error);
    return false;
  }
};
