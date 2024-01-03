const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SE_HOST,
        port: process.env.SE_PORT,
        auth: {
          user: process.env.SE_EMAIL,
          pass:process.env.SE_PASSWORD
        }
      })
      const message ={
        from:`${process.env.SE_FROM_NAME} <${process.env.SE_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(message)
    
}
module.exports = sendEmail;