import React, { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    country: "Portugal",
    emailPref: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Register Data:", form);
  }

  return (
    <div className="register-root">
      <style>{registerCSS}</style>

      <div className="register-wrapper">
        <div className="register-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">powerframe</div>
        </div>

        <form className="register-card" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <div className="row-between">
            <label>Password:</label>
            <span className="forgot">Forgot password?</span>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p className="helper">
            Password should be at least 15 characters OR at least 8 characters
            including a number and a lowercase letter.
          </p>

          {/* USERNAME */}
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <p className="helper">
            Username may only contain alphanumeric characters or single
            hyphens, and cannot begin or end with a hyphen.
          </p>

          {/* COUNTRY */}
          <label>Your Country/Region</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
          >
            <option>Portugal</option>
            <option>Netherlands</option>
            <option>Germany</option>
            <option>United States</option>
          </select>
          <p className="helper">
            For compliance reasons, we’re required to collect country
            information to send you occasional updates and announcements.
          </p>

          {/* EMAIL PREF */}
          <div className="checkbox-row">
            <input
              type="checkbox"
              name="emailPref"
              checked={form.emailPref}
              onChange={handleChange}
            />
            <label>Receive occasional product announcements</label>
          </div>

          {/* CTA */}
          <button className="btn-create" type="submit">
            Create account &gt;
          </button>

          {/* LEGAL */}
          <p className="legal">
            By creating an account, you agree to the Terms of Service. For more
            information about Powerframe privacy practices, see the Privacy
            Policy.
          </p>

          <div className="watermark">powerframe</div>
        </form>
      </div>
    </div>
  );
}

/* ========================= CSS ========================= */

const registerCSS = `
.register-root {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #1c0066, #7a00cc);
  font-family: sans-serif;
  color: white;
}

.register-wrapper {
  text-align: center;
}

.register-logo {
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 40px;
}

.logo-text {
  font-size: 22px;
  margin-top: 5px;
  letter-spacing: 2px;
}

.register-card {
  width: 420px;
  padding: 35px;
  border-radius: 30px;
  background: rgba(30, 20, 90, 0.6);
  backdrop-filter: blur(14px);
  border: 2px solid rgba(255,255,255,0.6);
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
}

input, select {
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-bottom: 10px;
  background: rgba(255,255,255,0.2);
  color: white;
}

input::placeholder {
  color: rgba(255,255,255,0.6);
}

.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot {
  font-size: 12px;
  color: #8ab4ff;
  cursor: pointer;
}

.helper {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 12px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
}

.btn-create {
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #7a00ff, #b100ff);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
}

.legal {
  font-size: 10px;
  opacity: 0.7;
  text-align: center;
}

.watermark {
  margin-top: 20px;
  font-size: 12px;
  opacity: 0.5;
  text-align: center;
}
`;