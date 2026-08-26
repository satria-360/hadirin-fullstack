function InputField({ type, placeholder, value, onChange, icon }) {
    return (
        <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                {icon}
            </div>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full h-[52px] bg-white/[0.06] border border-white/10 rounded-xl pl-12 pr-4 text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.09] transition-all"
            />
        </div>
    );
}

export default InputField;