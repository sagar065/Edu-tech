import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try{
        const { data, error } = await resend.emails.send({
        from: ' "StudyNotion || Sagar Singh" <onboarding@resend.dev> ',
        to: email,
        subject: title,
        html: body,
      });

        if (error) {
            console.error({ error });
            return null;
        }

        console.log({ data });
        return data;
    }
  
    catch(error){ 
    console.error({ "Mail Sending Error": error });
    return null;
    }
};

module.exports = mailSender;