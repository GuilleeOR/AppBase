interface FooterProps {
    className?: string
}

const Footer: React.FC<FooterProps> = ({className}) => {
  return (
    <footer className={className}>
        <p>© {new Date().getFullYear()} Mi Aplicación React</p>
    </footer>
  )
}

export default Footer