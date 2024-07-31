import '../../index.scss'

export const Footer = () => {
    const fullYear = new Date().getFullYear()
    return (
        <footer>
            <p>Copyright © {fullYear} </p>
        </footer>
    );
};