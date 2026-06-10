const Badge = ({ children, className }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}>
    {children}
  </span>
)
export default Badge;