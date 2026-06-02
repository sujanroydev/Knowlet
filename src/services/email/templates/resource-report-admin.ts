export function newResourceReportTemplate({
  userId,
  resourceId,
  reportReason,
  reportDetails,
}: {
  userId: string;
  resourceId: string;
  reportReason: string;
  reportDetails?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>🚨 New Resource Report</h2>

      <p>
        A user has submitted a report for a resource on Knowlet.
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
            <strong>User ID</strong>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${userId}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <strong>Resource ID</strong>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${resourceId}
          </td>
        </tr>

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
        Please review this report in the admin dashboard.
      </p>

      <p style="color: #666;">
        Knowlet Automated Notification
      </p>
    </div>
  `;
}
