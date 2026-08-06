/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the Google GenAI SDK with server-side API key
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (aiApiKey && !aiApiKey.includes('MY_GEMINI_API_KEY')) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn('GEMINI_API_KEY is not defined or is a placeholder. Gemini features will run in offline sandbox mode.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // API Route: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: Cold Email Grader (AI)
  app.post('/api/ai/grade-email', async (req, res) => {
    const { emailText } = req.body;
    if (!emailText) {
      res.status(400).json({ error: 'emailText parameter is required.' });
      return;
    }

    if (ai) {
      try {
        const prompt = `Review this cold email and provide a score 0-100 and split it across 5 criteria (20 points each):
1. subject line
2. opening line
3. personalization
4. clarity of the ask
5. length

For each criterion, provide the score and a blunt, specific, constructive tip that quotes the EXACT line from the email that needs fixing. Do NOT give generic advice. If a criterion has no representation in the text, explain it bluntly and award low points.

Email to review:
"${emailText}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                totalScore: { type: Type.INTEGER },
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      score: { type: Type.INTEGER },
                      tip: { type: Type.STRING }
                    },
                    required: ["name", "score", "tip"]
                  }
                }
              },
              required: ["totalScore", "criteria"]
            },
            temperature: 0.5
          }
        });

        res.json(JSON.parse(response.text || '{}'));
      } catch (error: any) {
        console.error('Gemini API Error in Email Grader:', error);
        res.status(500).json({ error: 'Failed to grade email using AI.' });
      }
    } else {
      const mockResult = {
        totalScore: 56,
        criteria: [
          {
            name: "Subject Line",
            score: 11,
            tip: `The subject line is too generic. Citing: "Urgent partnership opportunity" looks like a mass sales blast. Be specific or mention a common referral.`
          },
          {
            name: "Opening Line",
            score: 12,
            tip: `Using cliches like "Hope this email finds you well" wastes precious reader attention. Quote: "I am writing to you because..." is self-centered. Start with their world instead.`
          },
          {
            name: "Personalization",
            score: 9,
            tip: `Fails to mention why this specific target was chosen. Quote: "Dear executive / owner" is completely generic and lazy.`
          },
          {
            name: "Clarity of the Ask",
            score: 14,
            tip: `Your call to action is too open-ended. Quote: "Let me know when you are free" puts too much scheduling friction on the reader. Propose a specific time.`
          },
          {
            name: "Length",
            score: 10,
            tip: `The email has multiple long paragraphs. Quote: "We offer full suite services such as website development, SEO ranking audits..." should be compressed into bullet points of 3 critical values.`
          }
        ]
      };
      res.json(mockResult);
    }
  });

  // API Route: Tagline Generator (AI)
  app.post('/api/ai/generate-taglines', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: 'name and description are required.' });
      return;
    }

    if (ai) {
      try {
        const prompt = `Generate exactly 10 taglines for the product named: "${name}" which does: "${description}".
Mix styles: bold, funny, minimalist, luxury, and exactly one "cursed one" (intentionally so-bad-it's-good, label this style "the cursed one").
Keep each tagline strictly under 8 words.
CRITICAL CONSTRAINT: You are FORBIDDEN from using any of these words: "unlock", "empower", "supercharge", "elevate". Do not use them in any form.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                taglines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      style: { type: Type.STRING }
                    },
                    required: ["text", "style"]
                  }
                }
              },
              required: ["taglines"]
            },
            temperature: 0.8
          }
        });

        res.json(JSON.parse(response.text || '{}'));
      } catch (error: any) {
        console.error('Gemini API Error in Tagline Generator:', error);
        res.status(500).json({ error: 'Failed to generate taglines using AI.' });
      }
    } else {
      const mockResult = {
        taglines: [
          { text: `Ditch spreadsheet hell. Manage ${name} visually.`, style: "bold" },
          { text: "Slay your project dragon. Without typing.", style: "funny" },
          { text: "Tasks. Done.", style: "minimalist" },
          { text: "Bespoke digital coordination for absolute focus.", style: "luxury" },
          { text: `${name}: Because typing is for energetic people.`, style: "the cursed one" },
          { text: "Stop talking. Start executing projects today.", style: "bold" },
          { text: "The anti-hustle project board.", style: "funny" },
          { text: "Pure structure.", style: "minimalist" },
          { text: "Architectural alignment for high output.", style: "luxury" },
          { text: "We do the work, you do the hanging around.", style: "the cursed one" }
        ]
      };
      res.json(mockResult);
    }
  });

  // API Route: Content Repurposer (AI)
  app.post('/api/ai/repurpose-content', async (req, res) => {
    const { sourceText, originalLink } = req.body;
    if (!sourceText) {
      res.status(400).json({ error: 'sourceText parameter is required.' });
      return;
    }

    if (ai) {
      try {
        const prompt = `Repurpose the following long-form text:
---
${sourceText}
---
Original Link: ${originalLink || 'N/A'}

Produce:
1. 5 standalone X (Twitter) posts (each a complete thought, no threads, no hashtags)
2. 1 LinkedIn post (short lines, hook in the very first sentence, strictly NO emojis)
3. 1 Plain-text email (100 words max, include link: ${originalLink || 'N/A'})
4. 3 alternative opening hooks for the piece itself.

REUSE actual original text phrases and numbers.
BAN these words: "game-changer", "dive in", "unlock".`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                xPosts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                linkedInPost: { type: Type.STRING },
                plainTextEmail: { type: Type.STRING },
                openingHooks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["xPosts", "linkedInPost", "plainTextEmail", "openingHooks"]
            },
            temperature: 0.6
          }
        });

        res.json(JSON.parse(response.text || '{}'));
      } catch (error: any) {
        console.error('Gemini API Error in Content Repurposer:', error);
        res.status(500).json({ error: 'Failed to repurpose content using AI.' });
      }
    } else {
      const mockResult = {
        xPosts: [
          "Most brands fail because they try to sell on the first click. High-intent search campaigns are the shortcut.",
          "Our SEO metrics show an 80% spike in inbound organic queries when you align semantic page headers correctly.",
          "Speed is the silent conversion killer. Reduce video elements and bundle JS to get paint times below 1.5 seconds.",
          "Stop writing passive titles. Direct actions and clear benefit statements out-click clever slogans 10 to 1.",
          "We managed over ₦15M in client revenue by doing one thing: stripping navigation links from direct marketing funnels."
        ],
        linkedInPost: "Your website conversion funnel has a leak you aren't paying attention to.\n\nMost sales websites keep persistent nav headers everywhere, giving cold visitors 20 options to exit.\n\nOur client stripped away all headers and added direct conversion blocks. Inbound leads grew by 40% in two weeks.\n\nSimplicity isn't just aesthetic—it is profitable.",
        plainTextEmail: `Hey,\n\nWe recently analyzed the direct sales funnels of 50 fast-growing software companies.\n\nThe findings were clear: the top-performing funnels have zero external distraction links. They use modular cards, mobile-responsive grids, and single direct calls to action.\n\nWe summarized the exact formulas and steps here:\n${originalLink || 'https://salamiconsult.com'}\n\nLet me know what you think.\n\nAbiodun Salami\nSalami Consult`,
        openingHooks: [
          "Your current website navigation is costing you 40% of your incoming leads.",
          "We spent ₦15M on search ads to discover this simple conversion layout.",
          "This is the exact landing-page structure that converts cold traffic in under 5 seconds."
        ]
      };
      res.json(mockResult);
    }
  });

  // API Route: Brief Generator (AI)
  app.post('/api/ai/generate-brief', async (req, res) => {
    const { q1, q2, q3, q4, q5 } = req.body;
    
    if (ai) {
      try {
        const prompt = `Expand these 5 answers into a detailed, professional, one-page campaign brief:
1. Goal: ${q1 || 'vague'}
2. Audience: ${q2 || 'vague'}
3. Channels: ${q3 || 'vague'}
4. Budget: ${q4 || 'vague'}
5. Constraints: ${q5 || 'vague'}

Create structured text for these exact sections:
- Objective
- Audience
- Key Message
- Channels
- Budget
- Timeline
- Success Metrics
- Out of Scope

CRITICAL CONSTRAINT: If any of the user answers are empty, extremely vague, or uninformative, you MUST place the highlighted phrase "NEEDS AN ANSWER" inside that brief section instead of making up details.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.STRING },
                audience: { type: Type.STRING },
                keyMessage: { type: Type.STRING },
                channels: { type: Type.STRING },
                budget: { type: Type.STRING },
                timeline: { type: Type.STRING },
                successMetrics: { type: Type.STRING },
                outOfScope: { type: Type.STRING }
              },
              required: ["objective", "audience", "keyMessage", "channels", "budget", "timeline", "successMetrics", "outOfScope"]
            },
            temperature: 0.5
          }
        });

        res.json(JSON.parse(response.text || '{}'));
      } catch (error: any) {
        console.error('Gemini API Error in Brief Generator:', error);
        res.status(500).json({ error: 'Failed to generate campaign brief using AI.' });
      }
    } else {
      const mockResult = {
        objective: q1 && q1.length > 5 ? `To scale inbound conversion leads by deploying highly targeted paid search ads.` : `NEEDS AN ANSWER: Please specify a concrete campaign goal.`,
        audience: q2 && q2.length > 5 ? `Specifically targeting tech professionals, business owners, and digital marketers.` : `NEEDS AN ANSWER: Please clarify who the target audience is.`,
        keyMessage: `High-ROI business acceleration engineered by Salami Abiodun Consult.`,
        channels: q3 && q3.length > 5 ? `Primary: Paid Google Search Ads. Supporting: Social Media (LinkedIn, X).` : `NEEDS AN ANSWER: Please state your main marketing channels.`,
        budget: q4 && q4.length > 5 ? `Allocated NGN value: ${q4}. Focused mostly on direct conversion keywords.` : `NEEDS AN ANSWER: Please specify budget details.`,
        timeline: q5 && q5.length > 5 ? `Hard constraint deadline: ${q5}.` : `NEEDS AN ANSWER: Please provide campaign timeline constraints.`,
        successMetrics: `- Cost Per Lead (CPL) reduction\n- Conversion rate improvement to over 4.5%`,
        outOfScope: `Unfocused offline publicity campaigns, print banners, or mass radio sponsorships.`
      };
      res.json(mockResult);
    }
  });

  // API Route: AI Tutor Chat
  app.post('/api/ai/tutor', async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message parameter is required.' });
      return;
    }

    // Prepare system instructions for the tech AI tutor
    const systemInstruction = 
      "You are a friendly, supportive, and highly knowledgeable TECH AI tutor named 'SAC AI Tutor' at SAC Academy. " +
      "SAC represents a hybrid ecosystem: a digital advertising/marketing agency and a high-caliber technical learning hub (Edtech) with courses on Scratch coding, Frontend Web Design, Python programming, Roblox 3D game design, Robotics & IoT, Graphics Design, Video Editing, React, SEO, and AI/Prompt Engineering. " +
      "You help students, teachers, parents, and clients with these tech topics. " +
      "We offer courses for children (ages 5-16), young adults, and professionals. " +
      "Always include the option to chat with a real human on WhatsApp at +234 815 422 4426 (or click 'Chat Live' on the widget banner) if users have questions about pricing, customized classes, or offline study centers. " +
      "Explain complex technical topics in simple, visual, and highly actionable terms. Use clean formatting, markdown, and " +
      "bullet points. If appropriate, write short code snippets. Always maintain an inspiring and helpful tone!";

    if (ai) {
      try {
        // Map history to the required parts schema for Gemini
        const contents = Array.isArray(history) ? history.map((msg: any) => ({
          role: msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })) : [];

        // Push current prompt
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        res.json({ text: response.text || "I'm sorry, I couldn't process that response." });
      } catch (error: any) {
        console.error('Gemini API Error in Tutor:', error);
        res.status(500).json({ 
          error: 'Failed to generate response from AI Tutor.', 
          details: error.message 
        });
      }
    } else {
      // Return simulated educational answers if no key is supplied
      setTimeout(() => {
        let reply = "Hello! I am running in Offline Sandbox mode. Let me help you with your tech query! ";
        const queryLower = message.toLowerCase();
        
        if (queryLower.includes('enroll') || queryLower.includes('eligible') || queryLower.includes('age') || queryLower.includes('who can')) {
          reply = "**Enrollment & Age Groups**:\n- Children from ages 5 to 16, as well as young adults and professionals, are eligible!\n- We have tailored learning pathways: visual Scratch block coding for ages 5-11, and intermediate-to-advanced courses (Frontend Web Design, Python, Roblox 3D Game Design, Robotics & IoT) for teens aged 12-16.";
        } else if (queryLower.includes('robot') || queryLower.includes('hardware') || queryLower.includes('kit') || queryLower.includes('iot')) {
          reply = "**Robotics & IoT Hardware Requirements**:\n- No physical kits are required for our online interactive modules! We utilize advanced 3D virtual environments (like Tinkercad and virtual Micro:bit) so kids can design and program smart circuits completely software-side.\n- For physical training sessions, all hardware microcontrollers are supplied by SAC.";
        } else if (queryLower.includes('cert') || queryLower.includes('diploma') || queryLower.includes('accred')) {
          reply = "**Certifications & Diplomas**:\n- Yes! Every student who successfully completes 100% of their course modules, capstone projects, and milestones receives an accredited SAC Digital Literacy & Tech Competency Certificate or Diploma.";
        } else if (queryLower.includes('whatsapp') || queryLower.includes('human') || queryLower.includes('speak to') || queryLower.includes('chat') || queryLower.includes('contact')) {
          reply = "**Speak with Salami Abiodun Consult (SAC)**:\n- You can chat directly with a real human counselor on WhatsApp at **+234 815 422 4426** or click the **Chat Live** button on the top banner of this widget!\n- You can also email our main office at **info.salamiabiodunconsult@gmail.com**.";
        } else if (queryLower.includes('react') || queryLower.includes('vite')) {
          reply += "\n\n**React Tips**:\n- React uses functional components and Hooks (`useState`, `useEffect`) to manage state.\n- Avoid infinite loops in `useEffect` by strictly specifying your dependency arrays.\n- Use custom hooks to isolate API requests and logic.";
        } else if (queryLower.includes('seo') || queryLower.includes('marketing') || queryLower.includes('ads')) {
          reply += "\n\n**SEO & Marketing Strategy**:\n- Use localized meta descriptions and key terms matching user queries.\n- Focus on page performance — slower sites lead to high bounce rates.\n- Run short target meta tests on landing pages before scaling budget.";
        } else if (queryLower.includes('firebase') || queryLower.includes('firestore')) {
          reply += "\n\n**Firestore Advice**:\n- Define secure access lists in `firestore.rules` preventing wild queries.\n- Separate private PII fields from public member attributes using split collections.\n- Always validate request parameters server-side or in security rule schemas.";
        } else {
          reply += `You asked about "${message}". As your SAC Mentor, I suggest starting with a small prototype, refining user pathways, testing layouts on mobile viewports, and building modular features step-by-step. Let me know if you need specific React code snippets or marketing hacks!`;
        }
        res.json({ text: reply });
      }, 800);
    }
  });

  // API Route: Parenting Tech & Learning Tips
  app.post('/api/ai/parenting', async (req, res) => {
    const { topic } = req.body;
    const systemInstruction = 
      "You are an expert educational psychologist and digital literacy counselor. " +
      "Generate short, practical advice for parents trying to encourage their children's technical skills, " +
      "inventive coding habits, responsible internet use, and digital product creation. Keep the output formatted as " +
      "three high-impact bullet points with bold headers.";

    const prompt = topic 
      ? `Provide 3 actionable tips for parents to help their children learn about: ${topic}`
      : "Provide 3 actionable parenting tips to help nurture technical curiosity and coding literacy in kids.";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6
          }
        });
        res.json({ advice: response.text || "Keep encourage tech curiosity daily." });
      } catch (error: any) {
        console.error('Gemini API Error in Parenting Advice:', error);
        res.status(500).json({ 
          error: 'Failed to fetch parenting tips from AI.', 
          details: error.message 
        });
      }
    } else {
      // Mock parenting advice response
      setTimeout(() => {
        res.json({
          advice: "**1. Co-Create Digital Products**:\nInstead of letting them only consume video streams, encourage them to customize small interactive game loops on Scratch or help you build a web list.\n\n" +
                  "**2. Gamify Real-Life Challenges**:\nTeach them basic algorithmic thinking (loops, branches, sequences) by sorting objects or planning schedules together.\n\n" +
                  "**3. Celebrate Technical Curiosity**:\nFrame errors as research data. If a program fails, reward their discovery of the bug rather than stressing the output!"
        });
      }, 500);
    }
  });

  // API Route: Create Real Appointment (Calendar event + Email delivery)
  app.post('/api/appointments/create', async (req, res) => {
    const { clientName, clientEmail, dateTime, serviceType, companyName, websiteUrl, googleAccessToken } = req.body;

    if (!clientEmail || !clientName || !dateTime || !serviceType) {
      res.status(400).json({ error: 'Required fields are missing.' });
      return;
    }

    const apptId = `appt-${Math.random().toString(36).substr(2, 9)}`;
    let meetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`;
    let calendarEventCreated = false;

    // 1. Try to create actual Google Calendar Event if accessToken is provided
    if (googleAccessToken) {
      try {
        console.log('Attempting to create real Google Calendar Event & Meet Link...');
        const googleCalendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
        
        const calendarResponse = await fetch(googleCalendarUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: `Salami Abiodun Consult - ${serviceType} Strategy Session`,
            description: `Your Free Website Performance Audit & Growth Strategy session. Website: ${websiteUrl || 'Not provided'}. Customized client features provided by SAC.`,
            start: {
              dateTime: new Date(dateTime).toISOString(),
              timeZone: 'UTC'
            },
            end: {
              dateTime: new Date(new Date(dateTime).getTime() + 45 * 60 * 1000).toISOString(), // 45 min slot
              timeZone: 'UTC'
            },
            attendees: [
              { email: clientEmail },
              { email: 'info.salamiabiodunconsult@gmail.com' }
            ],
            conferenceData: {
              createRequest: {
                requestId: `sac-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                conferenceSolutionKey: {
                  type: 'hangoutsMeet'
                }
              }
            }
          })
        });

        if (calendarResponse.ok) {
          const calendarData: any = await calendarResponse.json();
          const meetEntryPoint = calendarData.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video');
          if (meetEntryPoint?.uri) {
            meetLink = meetEntryPoint.uri;
            calendarEventCreated = true;
            console.log('Successfully created Google Calendar Event with real Google Meet Link:', meetLink);
          }
        } else {
          const errText = await calendarResponse.text();
          console.warn('Google Calendar API returned error status:', calendarResponse.status, errText);
        }
      } catch (err) {
        console.error('Failed to create real Google Calendar event:', err);
      }
    }

    // 2. Setup SMTP Nodemailer transporter and deliver real email
    let etherealUrl = '';
    try {
      const nodemailer = await import('nodemailer');
      
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || '587');
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const fromEmail = process.env.SMTP_FROM || 'info.salamiabiodunconsult@gmail.com';

      let transporter;
      if (host && user && pass) {
        transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log('Nodemailer initialized using SMTP credentials.');
      } else {
        // Fallback: Ethereal test SMTP account for robust live email deliveries
        console.log('No SMTP config found. Creating an Ethereal test SMTP account for real email delivery...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      if (transporter) {
        const appUrl = process.env.APP_URL || 'https://salamiabiodunconsult.com';
        
        // Dynamic HTML template centered purely on Salami Abiodun Consult's digital marketing features & client dashboard
        const htmlTemplate = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #334155; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Salami Abiodun Consult</h1>
              <p style="color: #10b981; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0;">Digital Marketing & Strategy Diagnostics</p>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
              <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 14px;">Your Consulting Session is Booked!</h2>
              <p style="color: #475569; font-size: 14px; margin: 0 0 18px 0; line-height: 1.5;">Hi <strong>${clientName}</strong>,</p>
              <p style="color: #475569; font-size: 14px; margin: 0 0 18px 0; line-height: 1.5;">Your Free SEO Diagnostics & Growth Strategy consultation has been successfully scheduled. Below are your meeting coordinates:</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.6; margin-top: 10px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b; width: 140px;">Consulting Host:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">Abiodun Salami (MD)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Scheduled Time:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${new Date(dateTime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Service Focus:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${serviceType}</td>
                </tr>
                ${companyName ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Brand / Company:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${companyName}</td>
                </tr>` : ''}
                ${websiteUrl ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Website Scraped:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;"><a href="${websiteUrl}" style="color: #10b981; text-decoration: none;">${websiteUrl}</a></td>
                </tr>` : ''}
              </table>
            </div>
            
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 16px; padding: 20px; margin-bottom: 28px; text-align: center;">
              <p style="color: #065f46; font-size: 14px; font-weight: 800; margin-top: 0; margin-bottom: 8px;">Active Google Meet Room</p>
              <p style="color: #047857; font-family: monospace; font-size: 13px; margin: 0 0 14px 0; word-break: break-all;">${meetLink}</p>
              <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 800; font-size: 13.5px; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Join Google Meet Session</a>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
              <h3 style="color: #0f172a; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 10px;">Grow Faster with Your Custom Client Dashboard</h3>
              <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 14px 0;">
                Salami Abiodun Consult has established a customized workspace for you. Create your free account to access:
              </p>
              <ul style="color: #475569; font-size: 13px; margin: 0 0 20px 0; padding-left: 20px; line-height: 1.7;">
                <li><strong>Live SEO & Brand Diagnostics:</strong> Full visual crawls of page speed, core web vitals, structured schema, and meta tag optimization.</li>
                <li><strong>Outbound Cold Email Grader:</strong> Real-time grading and constructive AI-powered tip streams for your outreach templates.</li>
                <li><strong>Unsolved Problem Cost Calculator:</strong> Quantify annual lost revenue with modular sales metrics.</li>
                <li><strong>Campaign Tagline Generator:</strong> Instant copy drafts optimized for direct response branding.</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 800; font-size: 13.5px; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Unlock Your Client Portal</a>
              </div>
            </div>
            
            <div style="margin-top: 36px; border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0;">Salami Abiodun Consult • Lagos, Nigeria</p>
              <p style="margin: 4px 0 0 0;">This email is confirmation of your digital marketing consulting booking.</p>
            </div>
          </div>
        `;

        // Send to Client
        const clientInfo = await transporter.sendMail({
          from: `"Salami Abiodun Consult" <${fromEmail}>`,
          to: clientEmail,
          subject: `Confirmed: SAC Strategy Session & SEO Diagnostics Audit`,
          html: htmlTemplate
        });

        // Send to Host (MD)
        await transporter.sendMail({
          from: `"Salami Abiodun Consult" <${fromEmail}>`,
          to: 'info.salamiabiodunconsult@gmail.com',
          subject: `New SAC Booking: ${clientName} (${serviceType})`,
          html: htmlTemplate
        });

        // If Ethereal test account was used, get preview link
        if (!host) {
          const nodemailerUrl = nodemailer.getTestMessageUrl(clientInfo);
          if (nodemailerUrl) {
            etherealUrl = nodemailerUrl;
            console.log('Ethereal Live Email Sent successfully! View preview link:', etherealUrl);
          }
        } else {
          console.log('Emails successfully delivered via custom SMTP server.');
        }
      }
    } catch (emailErr) {
      console.error('Nodemailer failed to process email delivery:', emailErr);
    }

    res.json({
      id: apptId,
      meetLink,
      status: 'confirmed',
      calendarEventCreated,
      etherealUrl
    });
  });

  // Newsletter Subscription Endpoint
  app.post('/api/subscribe', async (req, res) => {
    const { email, firstName } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    let etherealUrl = '';
    try {
      const nodemailer = await import('nodemailer');
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || '587');
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const fromEmail = process.env.SMTP_FROM || 'info.salamiabiodunconsult@gmail.com';

      let transporter;
      if (host && user && pass) {
        transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log('Nodemailer initialized for newsletter using SMTP.');
      } else {
        console.log('No SMTP config found for newsletter. Creating Ethereal fallback...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      if (transporter) {
        const htmlTemplate = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #334155; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Salami Abiodun Consult</h1>
              <p style="color: #10b981; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0;">Technical Adventure Hub</p>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
              <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 14px; text-align: center;">New Technical Adventure Registrant! 🚀</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; text-align: center; margin-bottom: 20px;">
                An individual has registered to start their Technical Adventure with SAC Tech Academy.
              </p>
              
              ${firstName ? `
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px;">
                <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 2px;">First Name</span>
                <strong style="font-size: 16px; color: #0f172a;">${firstName}</strong>
              </div>
              ` : ''}

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center;">
                <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 2px;">Registrant Email</span>
                <strong style="font-size: 16px; color: #10b981; word-break: break-all;">${email}</strong>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
                This registrant has been saved to your Firestore database. You can manage your contacts via your admin dashboard or sync them to your learning management service.
              </p>
            </div>

            <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #64748b;">Salami Abiodun Consult Ecosystem</p>
              <p style="margin: 0;">Automated Dispatch Desk • info.salamiabiodunconsult@gmail.com</p>
            </div>
          </div>
        `;

        const mailResult = await transporter.sendMail({
          from: `"Salami Abiodun Consult Insights" <${fromEmail}>`,
          to: 'info.salamiabiodunconsult@gmail.com',
          subject: `New SAC Tech Adventure Registrant: ${firstName ? `${firstName} (${email})` : email}`,
          html: htmlTemplate
        });

        if (!host) {
          const nodemailerUrl = nodemailer.getTestMessageUrl(mailResult);
          if (nodemailerUrl) {
            etherealUrl = nodemailerUrl;
            console.log('Ethereal Subscriber Email Sent! View preview link:', etherealUrl);
          }
        }
      }
    } catch (emailErr) {
      console.error('Nodemailer subscriber notification failed:', emailErr);
    }

    res.json({
      success: true,
      email,
      firstName,
      etherealUrl
    });
  });

  // API Route: Create Academy Free Trial (Calendar event + Paystack connection + Email delivery)
  app.post('/api/academy/free-trial', async (req, res) => {
    const { clientName, clientEmail, dateTime, courseInterest, googleAccessToken } = req.body;

    if (!clientEmail || !clientName || !dateTime || !courseInterest) {
      res.status(400).json({ error: 'Required fields are missing.' });
      return;
    }

    const apptId = `trial-${Math.random().toString(36).substr(2, 9)}`;
    let meetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`;
    let calendarEventCreated = false;

    // 1. Try to create actual Google Calendar Event if accessToken is provided
    if (googleAccessToken) {
      try {
        console.log('Attempting to create Academy Free Trial Google Calendar Event & Meet Link...');
        const googleCalendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
        
        const calendarResponse = await fetch(googleCalendarUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: `SAC Academy Free Trial - ${courseInterest}`,
            description: `Your interactive Free Trial Live Class with SAC Tech Academy. Course: ${courseInterest}. Automated scheduling and Gmail confirmation provided by SAC.`,
            start: {
              dateTime: new Date(dateTime).toISOString(),
              timeZone: 'UTC'
            },
            end: {
              dateTime: new Date(new Date(dateTime).getTime() + 45 * 60 * 1000).toISOString(), // 45 min slot
              timeZone: 'UTC'
            },
            attendees: [
              { email: clientEmail },
              { email: 'info.salamiabiodunconsult@gmail.com' }
            ],
            conferenceData: {
              createRequest: {
                requestId: `sac-academy-trial-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                conferenceSolutionKey: {
                  type: 'hangoutsMeet'
                }
              }
            }
          })
        });

        if (calendarResponse.ok) {
          const calendarData: any = await calendarResponse.json();
          const meetEntryPoint = calendarData.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video');
          if (meetEntryPoint?.uri) {
            meetLink = meetEntryPoint.uri;
            calendarEventCreated = true;
            console.log('Successfully created Google Calendar Event with real Google Meet Link:', meetLink);
          }
        } else {
          const errText = await calendarResponse.text();
          console.warn('Google Calendar API returned error status for Academy Free Trial:', calendarResponse.status, errText);
        }
      } catch (err) {
        console.error('Failed to create Academy Free Trial Google Calendar event:', err);
      }
    }

    // 2. Setup SMTP Nodemailer transporter and deliver real email
    let etherealUrl = '';
    try {
      const nodemailer = await import('nodemailer');
      
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || '587');
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const fromEmail = process.env.SMTP_FROM || 'info.salamiabiodunconsult@gmail.com';

      let transporter;
      if (host && user && pass) {
        transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log('Nodemailer initialized using SMTP credentials for Academy Free Trial.');
      } else {
        // Fallback: Ethereal test SMTP account for robust live email deliveries
        console.log('No SMTP config found. Creating an Ethereal test SMTP account for real email delivery...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      if (transporter) {
        const appUrl = process.env.APP_URL || 'https://salamiabiodunconsult.com';
        
        // Dynamic HTML template centered purely on Salami Abiodun Consult's SAC Tech Academy
        const htmlTemplate = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #334155; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">SAC Tech Academy</h1>
              <p style="color: #10b981; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0;">Salami Abiodun Consult • Technical Learning Ecosystem</p>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
              <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 14px;">Your Free Trial Class is Confirmed! 🚀</h2>
              <p style="color: #475569; font-size: 14px; margin: 0 0 18px 0; line-height: 1.5;">Hi <strong>${clientName}</strong>,</p>
              <p style="color: #475569; font-size: 14px; margin: 0 0 18px 0; line-height: 1.5;">Welcome to SAC Tech Academy! Your registration is complete, and your <strong>₦50 NGN refundable card connection check</strong> via Paystack was processed successfully. Your account is now active!</p>
              <p style="color: #475569; font-size: 14px; margin: 0 0 18px 0; line-height: 1.5;">Here are the coordinates for your live free trial session:</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.6; margin-top: 10px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b; width: 140px;">Selected Course:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${courseInterest}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Scheduled Time:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${new Date(dateTime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Ecosystem Host:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">Abiodun Salami (Managing Director)</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 16px; padding: 20px; margin-bottom: 28px; text-align: center;">
              <p style="color: #065f46; font-size: 14px; font-weight: 800; margin-top: 0; margin-bottom: 8px;">Active Google Meet Room</p>
              <p style="color: #047857; font-family: monospace; font-size: 13px; margin: 0 0 14px 0; word-break: break-all;">${meetLink}</p>
              <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 800; font-size: 13.5px; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Join Google Meet Session</a>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
              <h3 style="color: #0f172a; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 10px;">Explore Your SAC Tech Academy Dashboard</h3>
              <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0 0 14px 0;">
                You now have a personal Student dashboard in our sandbox portal. Log in to access:
              </p>
              <ul style="color: #475569; font-size: 13px; margin: 0 0 20px 0; padding-left: 20px; line-height: 1.7;">
                <li><strong>Interactive Tech Syllabus:</strong> View full curriculums on Frontend React, Design Thinking, and localized Diaspora Integration.</li>
                <li><strong>SAC AI Tutor Widget:</strong> Get instant, real-time code explanations and growth hacks custom-crafted for your tasks.</li>
                <li><strong>Gamified XP & Badges:</strong> Earn points and display certified badges as you complete challenges.</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 800; font-size: 13.5px; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Access SAC Portal</a>
              </div>
            </div>
            
            <div style="margin-top: 36px; border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0;">Salami Abiodun Consult • Lagos, Nigeria</p>
              <p style="margin: 4px 0 0 0;">This email is confirmation of your SAC Tech Academy Free Trial registration.</p>
            </div>
          </div>
        `;

        // Send to Student
        const clientInfo = await transporter.sendMail({
          from: `"SAC Tech Academy" <${fromEmail}>`,
          to: clientEmail,
          subject: `Confirmed: SAC Academy Free Trial Class & Onboarding Details`,
          html: htmlTemplate
        });

        // Send to Host (MD)
        await transporter.sendMail({
          from: `"SAC Tech Academy Admin" <${fromEmail}>`,
          to: 'info.salamiabiodunconsult@gmail.com',
          subject: `New SAC Academy Free Trial: ${clientName} (${courseInterest})`,
          html: htmlTemplate
        });

        // If Ethereal test account was used, get preview link
        if (!host) {
          const nodemailerUrl = nodemailer.getTestMessageUrl(clientInfo);
          if (nodemailerUrl) {
            etherealUrl = nodemailerUrl;
            console.log('Ethereal Live Academy Free Trial Email Sent successfully! View preview link:', etherealUrl);
          }
        } else {
          console.log('Academy Free Trial emails successfully delivered via custom SMTP server.');
        }
      }
    } catch (emailErr) {
      console.error('Nodemailer failed to process Academy Free Trial email delivery:', emailErr);
    }

    res.json({
      id: apptId,
      meetLink,
      status: 'confirmed',
      calendarEventCreated,
      etherealUrl
    });
  });

  // Vite integration as middleware (or static serving)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
