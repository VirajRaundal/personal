import SocialIcons from './SocialIcons';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <SocialIcons />
                <span className="footer-text">
                    © {new Date().getFullYear()} Viraj Raundal
                </span>
            </div>
        </footer>
    );
}
