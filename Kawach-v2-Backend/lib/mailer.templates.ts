

export async function generateSOSAlertToContactsEmail(sos_generated_by_user_name: string, ip_add: string, time: string, url: string) {
	return `
	
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOS Alert Notification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #d9534f;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .alert-box {
      background-color: #f9f2f2;
      border-left: 4px solid #d9534f;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .alert-title {
      font-size: 18px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 10px;
      color: #d9534f;
    }
    .info-item {
      margin-bottom: 12px;
      display: flex;
    }
    .info-label {
      font-weight: 600;
      min-width: 120px;
      color: #555;
    }
    .info-value {
      flex: 1;
    }
    .action-button {
      display: inline-block;
      background-color: #d9534f;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 600;
      margin-top: 15px;
      text-align: center;
    }
    .action-button:hover {
      background-color: #c9302c;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    @media only screen and (max-width: 480px) {
      .header h1 {
        font-size: 20px;
      }
      .content {
        padding: 20px;
      }
      .info-item {
        flex-direction: column;
      }
      .info-label {
        margin-bottom: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠ EMERGENCY SOS ALERT ⚠</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <h2 class="alert-title">Urgent: SOS Alert Triggered</h2>
        <p>An emergency SOS alert has been triggered and requires immediate attention.</p>
      </div>
      
      <div class="info-item">
        <div class="info-label">User:</div>
        <div class="info-value">${sos_generated_by_user_name}</div>
      </div>
     
      
      <div class="info-item">
        <div class="info-label">Time:</div>
        <div class="info-value">${time}</div>
      </div>
      
      <div style="text-align: center; margin-top: 25px;">
        <a href="${url}" class="action-button">View Alert Details</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #777;">
          This is an automated emergency notification. Respond, according to your organization's emergency protocols.
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Panthar InfoHub Pvt. Ltd. All rights reserved.</p>
      <p>This email was sent to you because you're registered to receive emergency alerts.</p>
    </div>
  </div>
</body>
</html>`
}
