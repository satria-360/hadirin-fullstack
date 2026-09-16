function Logo() {
    return (
        <div className="absolute top-10 left-24 w-[87px] h-[108px]">
            {/* Ganti dengan <img src="/logo.png" /> jika sudah punya logo */}
            <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                <span className="text-white/60 text-[10px] font-bold">LOGO</span>
            </div>
        </div>
    );
}

export default Logo;


