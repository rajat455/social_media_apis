const nodemailer = require("nodemailer")

const email = process.env.EMAIL
class SendEmail {
    constructor() {
    }

    newEmail(subject, mailText, to) {
        return new Promise((resolve, reject) => {
            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: email,
                    pass: "fzlbfbiqkhwcyvsg"
                }
            })

            let mailOptions = {
                from: email,
                to: to,
                subject: subject,
                text: mailText
            }

            transport.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('email has been sent', info.response)
                    resolve(info)
                }
            })

        })

    }
}

module.exports = new SendEmail()