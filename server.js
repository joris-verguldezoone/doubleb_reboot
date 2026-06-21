// server.js (Fichier Back-End pour Node.js)
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json()); 

const SUBSCRIBERS = [
    "verguldezoonejoris@yahoo.fr",
    "ponzio.fabien@gmail.com"
    // Ajoute le reste de tes 100 abonnés ici
];

app.post('/api/send-newsletter', async (req, res) => {
    const { subject, title, imageUrl, content, ctaText, ctaUrl } = req.body;

    if (!subject || !title || !content) {
        return res.status(400).json({ error: "Les champs Obligatoires (Objet, Titre, Contenu) manquent." });
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #111111; margin: 0; padding: 0; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f9f9f9; padding: 40px 0; }
            .content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; padding: 40px 20px; }
            .header { text-align: center; font-family: 'Montserrat', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 18px; letter-spacing: 3px; margin-bottom: 40px; text-transform: uppercase; }
            .hero-title { font-size: 24px; font-weight: 900; text-align: center; line-height: 1.2; margin-bottom: 30px; text-transform: uppercase; }
            .image-box { width: 100%; margin-bottom: 30px; text-align: center; }
            .image-box img { max-width: 100%; height: auto; display: block; }
            .body-text { color: #444444; font-size: 14px; line-height: 1.6; margin-bottom: 35px; white-space: pre-line; }
            .cta-box { text-align: center; margin-bottom: 40px; }
            .btn { display: inline-block; background-color: #111111; color: #ffffff !important; padding: 14px 35px; text-decoration: none; font-family: 'Montserrat', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
            .footer { border-top: 1px solid #dddddd; padding-top: 20px; text-align: center; font-size: 11px; color: #999999; }
            .footer p { margin: 0 0 5px 0; }
            .footer a { color: #999999; text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="content">
                <div class="header">FAB BENE</div>
                <h2 class="hero-title">${title}</h2>
                ${imageUrl ? `<div class="image-box"><img src="${imageUrl}" alt="Illustration"></div>` : ''}
                <div class="body-text">${content}</div>
                ${(ctaText && ctaUrl) ? `<div class="cta-box"><a href="${ctaUrl}" class="btn">${ctaText}</a></div>` : ''}
                <div class="footer">
                    <p>© Fabbene Style. Tous droits réservés.</p>
                    <p><a href="#">Se désabonner</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false, 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS 
            }
        });

        console.log("[SERVER] Tentative d'envoi de l'email...");

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM,        
            bcc: SUBSCRIBERS.join(', '),       
            subject: subject,
            html: emailHtml
        });

        console.log("[SERVER] Email envoyé avec succès !");
        res.status(200).json({ message: "La newsletter a été envoyée avec succès aux abonnés." });

    } catch (error) {
        console.error("[SERVER ERROR] Échec de l'envoi de l'email :", error);
        res.status(500).json({ error: "Erreur lors de l'envoi via SMTP.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[SERVER RUNNING] Serveur admin démarré sur http://localhost:${PORT}`));