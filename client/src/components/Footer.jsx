const Footer = () => {
    return (
        <footer className="bg-blue-700/60 py-5">
            <div className="text-center text-white text-medium">
                <p><b>&copy; {new Date().getFullYear()} echoMail. All rights reserved.</b> | Made with <span className="text-red-500">&hearts;</span> for <a href="https://summer.hackclub.com" className="underline">Summer of Making</a>.</p>

                <p>Open source under Apache 2.0. View on <a href="https://github.com/brianwalczak/echoMail" className="underline" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
                </div>
        </footer>
    );
};

export default Footer;