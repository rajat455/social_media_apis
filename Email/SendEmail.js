const nodemailer = require("nodemailer")

class SendEmail {
    constructor() { }

    newEmail(subject, mailText, to) {
        return  new Promise ((resolve,reject) => {
            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user:"rajatjayswal80@gmail.com",
                    pass: "fzlbfbiqkhwcyvsg"
                }
            })
    
            let mailOptions = {
                from: "rajatjayswal80@gmail.com",
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