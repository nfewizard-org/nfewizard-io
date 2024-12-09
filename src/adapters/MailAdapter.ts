/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */
import Environment from '@Modules/environment/Environment.js';
import { EmailConfig, EmailParams } from 'src/core/types';
import nodemailer from 'nodemailer';

class MailController {
    private environment: Environment;
    constructor(environment: Environment) {
        this.environment = environment;
    }

    private createTransporter(email: EmailConfig) {
        const { host, port, secure, auth: { user, pass } } = email;

        // const transporter = nodemailer.createTransport(email);
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });

        return transporter;
    }

    private mountMail(email: EmailConfig,  mailParams: EmailParams) {
        const { emailParams: { from, to } } = email;
        const { message, subject, attachments } = mailParams;

        const attachmentsWithVerifiedFileName = attachments?.map((attachment) => {
            if (!attachment.filename) {
                attachment.filename = false;
            }
            return attachment;
        })

        return {
            from,
            to,
            subject,
            html: message,
            attachments: attachmentsWithVerifiedFileName,
        };
    }

    sendEmail(mailParams: EmailParams) {
        try {
            const { email } = this.environment.getConfig();

            if (!email) {
                throw new Error('Email não configurado. Para utilizar o envio de e-mail certifique-se de passar as configurações corretas para o método "NFE_LoadEnvironment".');
            }

            const transporter = this.createTransporter(email);
            const mailOptions = this.mountMail(email, mailParams);

            transporter.sendMail(mailOptions, (error: any, info) => {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                }
            });
        } catch (error: any) {
            throw new Error(`Erro ao enviar e-mail: ${error.message}`);
        }
    }

}

export default MailController;