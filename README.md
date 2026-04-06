# 🔐 MFA Cloud Authentication System

A **Multi-Factor Authentication (MFA) Cloud-Based Web Application** built using Python that enhances login security by combining **password authentication + OTP verification**.

This project demonstrates how modern systems protect user accounts using multiple authentication layers instead of relying only on passwords.

---

## 📌 Project Description

This project implements a secure authentication system where users must verify their identity using:

* Username & Password
* One-Time Password (OTP)

MFA is widely used in cloud platforms because it significantly reduces the risk of unauthorized access. Even if a password is compromised, an attacker cannot log in without the second authentication factor ([GitHub Docs][1]).

---

## 🚀 Features (Based on Your Code)

✅ User Registration System
✅ Secure Login System
✅ OTP Generation & Verification
✅ Session Management
✅ Basic Cloud-Based Authentication Flow
✅ Error Handling for Invalid Login / OTP

---

## 🛠️ Tech Stack

**Frontend:**

* HTML5
* CSS3
* JavaScript

**Backend:**

* Python
* Flask

**Database:**

* SQLite (Local Database)

---

## 📂 Project Structure (Customized)

```
MFA-CLOUD-PRO/
│
├── static/                # CSS, JS, Images
├── templates/             # HTML pages (login, register, OTP)
│   ├── login.html
│   ├── register.html
│   ├── otp.html
│   └── dashboard.html
│
├── app.py                 # Main Flask application
├── database.db            # SQLite database
├── requirements.txt       # Python dependencies
└── README.md              # Documentation
```

---

## ⚙️ How It Works

1️⃣ User registers with username & password
2️⃣ User logs in
3️⃣ System validates credentials
4️⃣ OTP is generated dynamically
5️⃣ OTP is sent (email/console-based depending on your code)
6️⃣ User enters OTP
7️⃣ Access is granted only after successful verification

---

## 🔐 Authentication Flow

```
User → Login → Password Check → OTP Generated → OTP Verification → Access Granted
```

This layered approach ensures higher security compared to single-factor authentication.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Dhruvpatel220204/MFA-CLOUD-PRO.git
cd MFA-CLOUD-PRO
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run Application

```bash
python app.py
```

### 4️⃣ Open in Browser

```
http://127.0.0.1:5000/
```

---

## 🧪 Sample Test Flow

* Register a new user
* Login using credentials
* Check OTP (console/email)
* Enter OTP to access dashboard

---

## 🔒 Security Highlights

* Prevents unauthorized access
* Adds extra layer beyond passwords
* Reduces risk of hacking attempts
* Implements real-world MFA concept

---

## 🎯 Use Cases

* Cloud applications
* Banking systems
* Secure login portals
* Enterprise authentication

---

## 📸 Screenshots

👉 Add these:

* Login Page
* Registration Page
* OTP Verification Page
* Dashboard

---

## 📌 Future Improvements

🔹 Email/SMS OTP Integration (Twilio / SMTP)
🔹 Google Authenticator (TOTP)
🔹 Biometric Authentication
🔹 Cloud Deployment (AWS / Azure)
🔹 JWT Token-Based Authentication
🔹 Role-Based Access Control

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 👨‍💻 Author

**Dhruv Patel**
🔗 GitHub: [https://github.com/Dhruvpatel220204](https://github.com/Dhruvpatel220204)

---

## ⭐ Support

If you like this project, don’t forget to ⭐ the repo!

---

## 📜 License

This project is licensed under the **MIT License**

---


[1]: https://docs.github.com/en/enterprise-cloud%40latest/authentication/securing-your-account-with-two-factor-authentication-2fa/accessing-github-using-two-factor-authentication?utm_source=chatgpt.com "Accessing GitHub using two-factor authentication - GitHub Enterprise Cloud Docs"
