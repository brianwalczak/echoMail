const Footer = () => {
    return (
        <footer className="border-t border-white/10 py-8">
            <div className="text-center text-gray-500 text-sm space-y-1">
                <p>&copy; {new Date().getFullYear()} echoMail. All rights reserved. | Made with <span className="text-red-500">&hearts;</span> for <a href="https://summer.hackclub.com" className="text-gray-400 hover:text-white transition">Summer of Making</a> & <a href="https://flavortown.hackclub.com" className="text-gray-400 hover:text-white transition">Flavortown</a>.</p>

                <p>Open source under Apache 2.0. View on <a href="https://github.com/brianwalczak/echoMail" className="text-gray-400 hover:text-white transition" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
                </div>
        </footer>
    );
};

export default Footer;