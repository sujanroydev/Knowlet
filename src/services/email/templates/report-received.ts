export function reportReceivedTemplate({
  reportReason,
  reportDetails,
}: {
  reportReason: string;
  reportDetails?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Report Received</h2>

      <p>
        Thank you for helping improve Knowlet.
      </p>

      <p>
        We have received your report and will review it shortly.
      </p>

      <table
        style="
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        "
      >
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <strong>Reason</strong>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${reportReason}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <strong>Details</strong>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${reportDetails || "No additional details provided"}
          </td>
        </tr>
      </table>

      <p style="margin-top: 24px;">
        Our team will review the report and take appropriate action if needed.
      </p>

      <p style="color: #666;">
        Team Knowlet
      </p>
    </div>
  `;
}
