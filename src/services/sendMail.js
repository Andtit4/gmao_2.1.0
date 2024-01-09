import * as nodemailer from 'nodemailer';
import { format } from 'date-fns';
export default {
// import * as nodemailer from '@types/nodemailer'

  sendMail(mot_de_passe, email) {

    // const nodemailer = require('nodemailer')
    // const { format } = require('date-fns')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lirsitogo2021@gmail.com',
        pass: 'phlelzqtfdpuvalx'
      }
    })

    const currentDate = new Date()

    const formattedDate = format(currentDate, 'yyyy-MM-dd')
    const formattedTime = format(currentDate, 'HH:mm:ss')

    const mailOptions = {
      from: 'lirsitogo2021@gmail.com',
      to: email,
      subject: 'CREATION DE COMPTE GMAO',
      html: `<h3><img src='https://togocom.tg/wp-content/uploads/2022/02/Icone-Togocom@2x.png' width='20px' />  Energy Eye</h3>. <p>Votre compte GMAO à été créé ce </p>  <p> <span style='color=red'>${formattedDate}</span> à <span style='color=red'>${formattedTime} votre mot de passe est <strong>${mot_de_passe}</strong>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Erreur lors de l'envoi de l'e-mail:", error)
      } else {
        console.log('E-mail envoyé:', info.response)
      }
    })
  }
}
