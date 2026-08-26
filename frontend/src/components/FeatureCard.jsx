function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-[#1A1A1A] rounded-[24px] p-8 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
            {/* Ikon fitur */}
            <div className="w-14 h-14 bg-gradient-to-br from-[#4285F4] to-[#030748] rounded-2xl flex items-center justify-center text-2xl">
                {icon}
            </div>

            {/* Judul */}
            <h3 className="text-white text-lg font-semibold">{title}</h3>

            {/* Deskripsi */}
            <p className="text-[#808080] text-sm leading-relaxed">{description}</p>
        </div>
    );
}

export default FeatureCard;