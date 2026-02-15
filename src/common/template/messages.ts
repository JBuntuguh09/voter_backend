export const newUser =(fname: string, 
    lname:string,
    username: string,
    email: string,
    pword: string
)=>{
    return `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="color: #2c3e50;">Welcome to Hohoe Smart City! 🎉</h2>

      <p>
        Dear <strong>${fname ?? ''} ${lname ?? ''}</strong>,
      </p>

      <p>
        We are excited to have you on board and look forward to helping you access smart services designed to make life in Hohoe easier.
      </p>

      <p>
        Your account has been successfully created. Below are your login details:
      </p>

      <div style="background-color: #f0f3f7; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${pword}</p>
      </div>

      <p style="color: #c0392b;">
        For your security, please log in and change your password immediately after your first sign-in.
      </p>

      <p>
        <a 
          href="https://hohoe.smartcitygh.com"
          style="display: inline-block; padding: 12px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
          🔗 Login to Hohoe Smart City
        </a>
      </p>

      <p>
        If you did not request this account or need any assistance, please contact our support team at
        <a href="mailto:support@smartcitygh.com">support@smartcitygh.com</a> / 0536901206.
      </p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />

      <p>
        Thank you for joining Hohoe Smart City. We are glad to have you with us!
      </p>

      <p>
        Warm regards,<br />
        <strong>Hohoe Smart City Team</strong><br />
        <a href="https://hohoe.smartcitygh.com">https://hohoe.smartcitygh.com</a>
      </p>

    </div>`
}

export const ResendMess = (
  fname: string,
  lname: string,
  username: string,
  email: string,
  pword: string
) => {
  return `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <h2 style="color: #2c3e50;">Hohoe Smart City – Login Reset Request 🔐</h2>

    <p>
      Hello <strong>${fname ?? ""} ${lname ?? ""}</strong>,
    </p>

    <p>
      We received a request to reset your login credentials for your Hohoe Smart City account. 
      Please find your updated login details below.
    </p>

    <div style="background-color: #f0f3f7; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${pword}</p>
    </div>

    <p>
      For security reasons, we strongly recommend that you log in and change your password immediately.
    </p>

    <p>
      <a 
        href="https://hohoe.smartcitygh.com"
        style="display: inline-block; padding: 12px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
      >
        🔗 Login to Hohoe Smart City
      </a>
    </p>

    <p>
      If you did not request this reset, please contact our support team immediately at
      <a href="mailto:support@smartcitygh.com">support@smartcitygh.com</a> or 0536901206.
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />

    <p>
      Thank you for using Hohoe Smart City. We’re here to help keep your account secure.
    </p>

    <p>
      Kind regards,<br />
      <strong>Hohoe Smart City Team</strong><br />
      <a href="https://hohoe.smartcitygh.com">https://hohoe.smartcitygh.com</a>
    </p>

  </div>`;
};


export const newCollector =(fname: string, 
    lname:string,
    username: string,
    email: string,
    pword: string
)=>{
    return `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="color: #2c3e50;">Welcome to Hohoe Smart City! 🎉</h2>

      <p>
        Dear <strong>${fname ?? ''} ${lname ?? ''}</strong>,
      </p>

      <p>
        We are excited to have you on board as a collector and look forward to helping you access smart services designed to make life in Hohoe easier.
      </p>

      <p>
        Your account has been successfully created. Below are your login details:
      </p>

      <div style="background-color: #f0f3f7; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${pword}</p>
      </div>

      <p style="color: #c0392b;">
        For your security, please log in and change your password immediately after your first sign-in.
      </p>

      <p>
        <a 
          href="https://hohoe.smartcitygh.com"
          style="display: inline-block; padding: 12px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
          🔗 Login to Hohoe Smart City
        </a>
      </p>

      <p>
        If you did not request this account or need any assistance, please contact our support team at
        <a href="mailto:support@smartcitygh.com">support@smartcitygh.com</a>.
      </p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />

      <p>
        Thank you for joining Hohoe Smart City. We are glad to have you with us!
      </p>

      <p>
        Warm regards,<br />
        <strong>Hohoe Smart City Team</strong><br />
        <a href="https://hohoe.smartcitygh.com">https://hohoe.smartcitygh.com</a>
      </p>

    </div>`
}