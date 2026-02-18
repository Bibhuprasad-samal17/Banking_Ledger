// Minimal email service stub — replace with real provider later
async function sendRegistrationEmail(email, name) {
    // In production replace with real email sending (nodemailer, SES, etc.)
    console.log(`Sending registration email to ${email} (name: ${name})`);
    return Promise.resolve();
}

module.exports = {
    sendRegistrationEmail
};
