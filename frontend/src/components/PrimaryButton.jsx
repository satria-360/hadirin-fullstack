function PrimaryButton({ children }) {
    return (
        <a
            href="/login"
            className="px-10 py-4 bg-gradient-to-r from-white to-[#999999] text-[#1A1A1A] text-lg font-bold rounded-3xl hover:opacity-90 active:scale-[0.98] transition-all inline-block"
        >
            {children}
        </a>
    );
}

export default PrimaryButton;