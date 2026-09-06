import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req) => {
   if (req.method !== "POST") {
      return new Response(
         JSON.stringify({
            success: false,
            message: "Method not allowed",
         }),
         {
            status: 405,
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   }

   try {
      const { name, phone, email, message } = await req.json();

      // Validate required fields
      if (!name || !email || !message) {
         return new Response(
            JSON.stringify({
               success: false,
               message: "Name, email and message are required.",
            }),
            {
               status: 400,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
      }

      const { data, error } = await resend.emails.send({
         from: "Website Contact <onboarding@resend.dev>",
         to: ["ecommerce.bazzarr@gmail.com"],
         replyTo: email,

         subject: `New Contact Message from ${name}`,

         html: `
        <h2>New Contact Form Submission</h2>
        <p>
          <strong>Name:</strong> ${name}
        </p>
        <p>
          <strong>Phone:</strong> ${phone || "Not provided"}
        </p>
        <p>
          <strong>Email:</strong> ${email}
        </p>
        <hr />
        <h3>Message</h3>
        <p>
          ${message.replace(/\n/g, "<br>")}
        </p>
      `,
      });

      if (error) {
         console.error("Resend Error:", error);

         return new Response(
            JSON.stringify({
               success: false,
               message: "Failed to send email.",
            }),
            {
               status: 500,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
      }

      return new Response(
         JSON.stringify({
            success: true,
            message: "Email sent successfully.",
            id: data?.id,
         }),
         {
            status: 200,
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   } catch (error) {
      console.error("Function Error:", error);

      return new Response(
         JSON.stringify({
            success: false,
            message: "Something went wrong.",
         }),
         {
            status: 500,
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   }
};