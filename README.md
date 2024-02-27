# Discord Clone

Discord Clone Build With Next.js 14 + Typescript + shandcn/ui.

## Demo

https://discord-eiag.onrender.com

## Documation

- clerk Authentication https://clerk.com
- Aiven https://console.aiven.io used for MySQL Database which gives free tier.
- LiveKit https://livekit.io used which is the open-source WebRTC stack for building scalable, real-time audio and video experiences into your application.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISH_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=YOUR_DATABASE_URL

UPLOADTHING_SECRET=YOUR_UPLOADTHING_SECRET
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_ID

LIVEKIT_API_KEY=YOUR_LIVEkIT_API_KEY
LIVEKIT_API_SECRET=YOUR_LIVEkIT_API_SECRET
NEXT_PUBLIC_LIVEKIT_URL=YOUR_LIVEkIT_URL
```

## Installation

Install my-project with npm

```bash
  npm install discord-clone
  cd discord-clone
  npm run dev
```

## Features

- Next.js 14 + Typescript + shadcn/ui
- Clerk Authentication
- file upload with uploadthing
- form handling with react hook form and validation with zod
- Prisma + MySQL
- socket.io Live chat
- WebRTC (LiveKit) For Vedio + Audio Stream

## 🚀 About Me

I'm a full stack developer...

## Feedback

If you have any feedback, please reach out to us at yogeshvanzara98@gmail.com


## FAQ

#### It's not loading properly?

Wait for few Seconds server goes down if there is no current log it will be active.
