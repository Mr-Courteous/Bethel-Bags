import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Bethel Empire <orders@bethelempire.com>";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

// ── Order confirmation email ──────────────────────────────────────────────
export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  shippingAddress: string;
  city: string;
  state: string;
  paystackRef: string | null;
  items: { name: string; quantity: number; price: number; image?: string | null }[];
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-family:Georgia,serif;color:#0A0A0A;">${item.name}</span><br/>
          <span style="font-size:12px;color:#6B6B6B;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#0A0A0A;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F6F0;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Gold top bar -->
        <tr><td height="4" style="background:linear-gradient(90deg,#A07C2A,#E8C97A,#C9A84C,#E8C97A,#A07C2A);"></td></tr>

        <!-- Header -->
        <tr>
          <td style="background:#0A0A0A;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#fff;letter-spacing:4px;">BETHEL EMPIRE</p>
            <p style="margin:6px 0 0;font-size:11px;letter-spacing:6px;color:#C9A84C;text-transform:uppercase;">Premium Handcrafted Bags</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;">Order Confirmed</p>
            <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:30px;color:#0A0A0A;">Thank you, ${order.customerName.split(" ")[0]}!</h1>
            <p style="color:#6B6B6B;line-height:1.6;margin:0 0 24px;">Your order has been received and payment confirmed. We'll begin preparing your bag(s) right away.</p>

            <!-- Order number box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;border-left:3px solid #C9A84C;margin-bottom:32px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B6B;">Order Number</p>
                  <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#0A0A0A;">${order.orderNumber}</p>
                </td>
                <td style="padding:16px 20px;text-align:right;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B6B;">Payment Ref</p>
                  <p style="margin:4px 0 0;font-family:monospace;font-size:12px;color:#6B6B6B;">${order.paystackRef || "—"}</p>
                </td>
              </tr>
            </table>

            <!-- Items -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B6B;">Items Ordered</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${itemsHtml}
              <tr>
                <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#0A0A0A;">Total Paid</td>
                <td style="padding:16px 0 0;text-align:right;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#C9A84C;">${formatPrice(order.total)}</td>
              </tr>
            </table>

            <!-- Delivery info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;margin-bottom:32px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B6B;">Delivery Address</p>
                  <p style="margin:0;color:#0A0A0A;line-height:1.6;">${order.shippingAddress}<br/>${order.city}, ${order.state}</p>
                </td>
              </tr>
            </table>

            <!-- What happens next -->
            <p style="margin:0 0 16px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B6B;">What Happens Next</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ["1", "Order Processing", "We'll carefully prepare and pack your bag(s) within 1–2 business days."],
                ["2", "Dispatch", "Your order will be handed to our courier and you'll receive a tracking number."],
                ["3", "Delivery", "Expect delivery within 3–5 business days (Lagos) or 5–7 days (other states)."],
              ].map(([n, title, desc]) => `
              <tr>
                <td width="36" valign="top" style="padding:0 12px 16px 0;">
                  <div style="width:28px;height:28px;background:#C9A84C;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:#0A0A0A;font-size:13px;text-align:center;line-height:28px;">${n}</div>
                </td>
                <td valign="top" style="padding:0 0 16px;">
                  <p style="margin:0 0 2px;font-weight:600;color:#0A0A0A;font-size:14px;">${title}</p>
                  <p style="margin:0;color:#6B6B6B;font-size:13px;line-height:1.5;">${desc}</p>
                </td>
              </tr>`).join("")}
            </table>

            <p style="margin:32px 0 0;color:#6B6B6B;font-size:13px;line-height:1.6;">
              Questions? Reply to this email or reach us on WhatsApp. We're always happy to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0A0A0A;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#6B6B6B;letter-spacing:2px;">© ${new Date().getFullYear()} BETHEL EMPIRE · Made with ✦ in Nigeria</p>
          </td>
        </tr>
        <tr><td height="4" style="background:linear-gradient(90deg,#A07C2A,#E8C97A,#C9A84C,#E8C97A,#A07C2A);"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Order Confirmed – ${order.orderNumber} | Bethel Empire`,
      html,
    });
    console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
  } catch (err) {
    // Non-fatal — log but don't crash the payment flow
    console.error("Failed to send order confirmation email:", err);
  }
}

// ── Contact form notification email ───────────────────────────────────────
export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bethelempire.com";
  const html = `
<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
  <div style="background:#0A0A0A;padding:20px;text-align:center;">
    <p style="margin:0;color:#C9A84C;font-size:18px;font-weight:bold;letter-spacing:3px;">BETHEL EMPIRE</p>
    <p style="margin:4px 0 0;color:#6B6B6B;font-size:11px;letter-spacing:2px;">NEW CONTACT MESSAGE</p>
  </div>
  <div style="background:#fff;padding:28px;border:1px solid #f0f0f0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["From", data.name],
        ["Email", data.email],
        ["Phone", data.phone || "—"],
        ["Subject", data.subject || "—"],
      ].map(([l, v]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f8f8f8;width:90px;color:#6B6B6B;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${l}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f8f8f8;color:#0A0A0A;font-size:14px;">${v}</td>
      </tr>`).join("")}
    </table>
    <div style="margin-top:20px;padding:16px;background:#F8F6F0;border-left:3px solid #C9A84C;">
      <p style="margin:0;color:#0A0A0A;line-height:1.6;font-size:14px;">${data.message}</p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:#6B6B6B;">Reply directly to this email to respond to ${data.name}.</p>
  </div>
</div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      replyTo: data.email,
      subject: `New Contact: ${data.subject || data.name} | Bethel Empire`,
      html,
    });
  } catch (err) {
    console.error("Failed to send contact notification:", err);
  }
}

// ── Enrolment confirmation email ──────────────────────────────────────────
export async function sendEnrolmentConfirmationEmail(data: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  coursePrice: number;
  paystackRef: string | null;
}) {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F8F6F0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td height="4" style="background:linear-gradient(90deg,#A07C2A,#E8C97A,#C9A84C,#E8C97A,#A07C2A);"></td></tr>
        <tr>
          <td style="background:#0A0A0A;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#fff;letter-spacing:4px;">BETHEL EMPIRE</p>
            <p style="margin:4px 0 0;font-size:10px;letter-spacing:5px;color:#C9A84C;text-transform:uppercase;">Training Academy</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:40px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">Enrolment Confirmed ✓</p>
            <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#0A0A0A;">Welcome, ${data.studentName.split(" ")[0]}!</h1>
            <p style="color:#6B6B6B;line-height:1.6;margin:0 0 28px;">Your enrolment has been confirmed and payment received. We're excited to have you join us!</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;border-left:3px solid #C9A84C;margin-bottom:28px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6B6B6B;">Course Enrolled</p>
                  <p style="margin:0;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#0A0A0A;">${data.courseTitle}</p>
                  <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#C9A84C;">${formatPrice(data.coursePrice)}</p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6B6B6B;">What to Expect</p>
            <ul style="margin:0 0 24px;padding-left:20px;color:#6B6B6B;line-height:2;font-size:14px;">
              <li>We will contact you within 24 hours with your class schedule</li>
              <li>All materials and tools are provided — just bring yourself</li>
              <li>Classes are hands-on from Day 1</li>
              <li>You will receive a Certificate of Completion upon graduation</li>
            </ul>
            <p style="margin:0;color:#6B6B6B;font-size:13px;">Payment Reference: <span style="font-family:monospace;color:#0A0A0A;">${data.paystackRef || "—"}</span></p>
          </td>
        </tr>
        <tr>
          <td style="background:#0A0A0A;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#6B6B6B;letter-spacing:2px;">© ${new Date().getFullYear()} BETHEL EMPIRE · Made with ✦ in Nigeria</p>
          </td>
        </tr>
        <tr><td height="4" style="background:linear-gradient(90deg,#A07C2A,#E8C97A,#C9A84C,#E8C97A,#A07C2A);"></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: data.studentEmail,
      subject: `Enrolment Confirmed – ${data.courseTitle} | Bethel Empire`,
      html,
    });
  } catch (err) {
    console.error("Failed to send enrolment confirmation email:", err);
  }
}
