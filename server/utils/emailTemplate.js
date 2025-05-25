function generateInProgressEmail(adminName, userName, fileName) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">Deizy Express Ltd • 4724 Towne Square Dr Apt 1610 Plano, TX 75024</p>
                    <h1 style="color: #2d6098; margin: 0;">Deizy Express</h1>
                    <p style="color: #6c757d; margin: 5px 0;">Document Processing Update</p>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
                    <p>Hi ${userName},</p>
                    <p>I am <strong>${adminName}</strong>, and I am currently working on your document <strong>${fileName}</strong>.</p>
                    <p>Thank you for trusting Deizy Express with your document. We are diligently processing your request, and you can always track the status of your document directly from your account dashboard to stay updated.</p>
                    <p>If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:deizyexpress@gmail.com" style="color: #2d6098; text-decoration: none;">deizyexpress@gmail.com</a>. We're here to help!</p>
                    <p>Best regards,</p>
                    <p><strong>${adminName}</strong><br/>Deizy Express Team</p>
                </div>
                    <p style="text-align: center; margin: 15px 0;">
                    <a href="https://diezyexpress.vercel.app//unsubscribe" style="color: #666; text-decoration: underline;">
                        Unsubscribe from these emails
                    </a>
                    </p>
                <p style="font-size:0px; color:transparent;">${Math.random().toString(36).substring(7)}</p>
                <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                    <p>This is an automated email. Please do not reply directly to this message.</p>
                </div>
            </div>
        </div>
    `;
}
function generateProcessedEmail(adminName, userName, fileName) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">Deizy Express Ltd • 4724 Towne Square Dr Apt 1610 Plano, TX 75024</p>
                    <h1 style="color: #2d6098; margin: 0;">Deizy Express</h1>
                    <p style="color: #6c757d; margin: 5px 0;">Document Processing Complete</p>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
                    <p>Hi ${userName},</p>
                    <p>Your document <strong>${fileName}</strong> has been successfully processed by <strong>${adminName}</strong>.</p>
                    <p>You can now login to your account to complete the payment and download your processed document.</p>
                    <p>After payment confirmation, you'll gain immediate access to download your file from your dashboard. If you encounter any issues or have questions, please contact us at <a href="mailto:deizyexpress@gmail.com" style="color: #2d6098; text-decoration: none;">deizyexpress@gmail.com</a>.</p>
                    <p>Best regards,</p>
                    <p><strong>${adminName}</strong><br/>Deizy Express Team</p>
                </div>
                <p style="text-align: center; margin: 15px 0;">
                    <a href="https://deizyexpress.com/unsubscribe" style="color: #666; text-decoration: underline;">
                        Unsubscribe from these emails
                    </a>
                </p>
                <p style="font-size:0px; color:transparent;">${Math.random().toString(36).substring(7)}</p>
                <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                    <p>This is an automated email. Please do not reply directly to this message.</p>
                </div>
            </div>
        </div>
    `;
}

module.exports = {
    generateInProgressEmail,
    generateProcessedEmail
};