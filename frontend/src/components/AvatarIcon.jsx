function AvatarIcon() {
    return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-white/20 flex items-center justify-center mb-5 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path
                    d="M24 26c4.95 0 9-4.05 9-9s-4.05-9-9-9-9 4.05-9 9 4.05 9 9 9zm0 3c-6.01 0-18 3.01-18 9v3h36v-3c0-5.99-11.99-9-18-9z"
                    fill="white"
                />
            </svg>
        </div>
    );
}

export default AvatarIcon;