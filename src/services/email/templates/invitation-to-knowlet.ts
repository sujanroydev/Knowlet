import { escapeHtml } from "@/utils/escape-html";

export function invitationToKnowletTemplate(name = "there") {
  const website = "https://knowlet.in";
  const year = new Date().getFullYear();

  return `
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="background-color:#f4f4f4;padding:24px 0;font-family:Arial,Helvetica,sans-serif;"
>
  <tr>
    <td align="center">

      <table
        role="presentation"
        width="600"
        cellpadding="0"
        cellspacing="0"
        style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;"
      >
        <!-- Header -->
        <tr>
          <td
            align="center"
            style="padding:32px;background:#2563eb;border-radius:8px 8px 0 0;"
          >
            <h1
              style="margin:0;font-size:30px;font-weight:bold;color:#ffffff;"
            >
              📚 Welcome to Knowlet
            </h1>

            <p
              style="margin:12px 0 0;font-size:16px;line-height:24px;color:#dbeafe;"
            >
              Study Smarter. Learn Better.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">

            <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#333333;">
              Hi ${escapeHtml(name)},
            </p>

            <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#333333;">
              I hope you're doing well!
            </p>

            <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#333333;">
              I'd like to invite you to try
              <strong>Knowlet</strong>, a platform built to make studying
              simpler, faster, and more organized for students.
            </p>

            <p
              style="margin:0 0 16px;font-size:16px;font-weight:bold;color:#111827;"
            >
              With Knowlet, you can:
            </p>

            <ul
              style="margin:0 0 28px;padding-left:22px;font-size:16px;line-height:30px;color:#333333;"
            >
              <li>📚 Access well-organized notes and study materials</li>
              <li>📝 Explore Previous Year Questions (PYQs)</li>
              <li>📄 Read PDFs and learning resources in one place</li>
              <li>🔍 Find topics quickly with an easy-to-use interface</li>
              <li>📱 Study anytime, from your phone or computer</li>
            </ul>

            <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#333333;">
              Whether you're preparing for exams or revising concepts,
              Knowlet is designed to help you save time and focus on learning.
            </p>

            <p style="margin:0 0 32px;font-size:16px;line-height:26px;color:#333333;">
              We'd love for you to join the community and share your feedback
              to help make Knowlet even better.
            </p>

            <!-- Buttons -->
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              align="center"
              style="margin:0 auto 36px;"
            >
              <tr>
                <td
                  bgcolor="#2563eb"
                  style="border-radius:6px;text-align:center;"
                >
                  <a
                    href="${website}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:14px 28px;
                      font-size:16px;
                      font-weight:bold;
                      color:#ffffff;
                      text-decoration:none;
                    "
                  >
                    Visit Knowlet
                  </a>
                </td>

                <td width="12"></td>

                <td
                  bgcolor="#16a34a"
                  style="border-radius:6px;text-align:center;"
                >
                  <a
                    href="${website}/signin"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:14px 28px;
                      font-size:16px;
                      font-weight:bold;
                      color:#ffffff;
                      text-decoration:none;
                    "
                  >
                    Sign In
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#333333;">
              Thank you for your time. I hope Knowlet becomes a valuable part
              of your learning journey.
            </p>

            <p style="margin:0;font-size:16px;line-height:28px;color:#333333;">
              Best regards,<br><br>

              <strong>Sujan Kumar Roy</strong><br>
              Founder &amp; Designer, Knowlet
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td
            align="center"
            style="
              padding:20px;
              border-top:1px solid #e5e7eb;
              font-size:13px;
              color:#6b7280;
            "
          >
            © ${year} Knowlet. All rights reserved.<br><br>

            <a
              href="${website}"
              target="_blank"
              style="color:#2563eb;text-decoration:none;"
            >
              ${website}
            </a>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
`;
}
