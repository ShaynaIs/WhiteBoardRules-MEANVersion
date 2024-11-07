import express from "express";
import nodemailer from "nodemailer";
import bodyparser from "body-parser";


const router = express.Router();

// Route for contact
router.get('/', (req, res) => {
    res.render('contact', {
        title: 'Contact'
    });
});

router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        // Your email service configuration
        service: 'Gmail',
        auth: {
            user: 'white.board.rules.24@gmail.com',
            pass: 'rwbo hcqr autj hbin'
        }
    });

    // Email message options
    const mailOptions = {
        from: 'white.board.rules.24@gmail.com',
        to: 'white.board.rules.24@gmail.com',
        subject: `Message from ${name} - ${email}`,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
});



export default router;
