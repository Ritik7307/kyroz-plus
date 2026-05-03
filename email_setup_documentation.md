# How to Set Up Real Email OTP Delivery

Right now, the system is just logging the OTPs to the terminal because it doesn't have real email credentials. To make the OTPs actually arrive in your inbox, the easiest and freest method is to use a **Gmail App Password**.

Here is how to configure it:

## 1. Get a Gmail App Password
Google doesn't allow third-party apps to log in with your normal password anymore. You must generate a special 16-character "App Password".

1. Go to your Google Account: [myaccount.google.com](https://myaccount.google.com/)
2. Click on **Security** on the left menu.
3. Scroll down to **"How you sign in to Google"** and make sure **2-Step Verification** is turned ON. (You cannot generate an App Password without this).
4. Click on **2-Step Verification**, scroll to the very bottom, and click on **App passwords**.
5. Give it a name (e.g., "KYROZ App") and click **Create**.
6. Google will give you a 16-character password (e.g., `abcd efgh ijkl mnop`). **Copy this!**

## 2. Add Credentials to your Backend
Open your `backend/.env` file. Add the following lines:

```env
# Email Configuration
SMTP_SERVICE=gmail
SMTP_USER=your.actual.email@gmail.com
SMTP_PASS=abcdefghijklmnop   # <--- Paste the 16-character App Password here (no spaces)
```

## 3. Restart the Server
Once you save the `.env` file, ensure your Node.js backend restarts. Now, when you click "Send OTP" on the signup page, the Node server will securely log into your Gmail and send the 6-digit code to the user!

---

*(Note: In the future, if you scale KYROZ to thousands of users, you would swap out Gmail for a professional SaaS email provider like **Resend**, **SendGrid**, or **Amazon SES**. The environment variables would just change to their specific SMTP host and ports).*
