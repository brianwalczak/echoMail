<h1 align="center">echoMail - Private mail for everyone.</h1>
<p align="center">A secure, private email service for creating free temporary and disposable addresses - no signup required!</p>

> [!WARNING]
> **This project is currently in its beta state as I gather user feedback. If you encounter any issues, please report them <a href='https://github.com/BrianWalczak/echoMail/issues'>here</a> :)**

## Features
- (📧) Create disposable, secure emails instantly - no signup required.
- (🔗) Use our free API to integrate disposable emails into your apps/libraries.
- (🛡️) Stay anonymous by using disposable emails instead of your real one.
- (📂) Your emails are never stored once your session ends. Your privacy is guaranteed.
- (🖥️) Optimized web interface for both desktop and mobile devices.
- (👤) Open-source under Apache 2.0 license - contribute or view it anytime.

## Getting Started
To get started with using `echoMail`, you can visit the website here: https://echo.brian.icu/

No account is required to create disposable emails. You can access the API without the use of an API key.

## Self-Hosting
> [!NOTE]
> **Self-hosting is optional and intended for developers or advanced users who want more control. Most users won't need to self-host.**

Prefer to host your own `echoMail` instance? `echoMail` is open-source under the Apache 2.0 license, and is easy to set up on your own server.

To start, you can download this repository by using the following:
```bash
git clone https://github.com/BrianWalczak/echoMail.git
cd echoMail
```

Before you continue, make sure that Node.js is properly installed (run `node --version` to check if it exists). If you don't have it installed yet, you can download it [here](https://nodejs.org/en/download).

Next, install the required dependencies and start the server (port 3000):
```bash
npm install
node .
```

The React + Vite frontend is located in the client folder. To launch a live development server:
```bash
cd client
npm install
npm run dev
```

By default, Vite will start the frontend on `http://localhost:5173`, and it will communicate with the backend on port 3000.

## Contributions

If you'd like to contribute to this project, please create a pull request [here](https://github.com/BrianWalczak/echoMail/pulls). You can submit your feedback or any bugs that you find on the <a href='https://github.com/BrianWalczak/echoMail/issues'>issues page</a>. Contributions are highly appreciated and will help us keep this project up-to-date!
