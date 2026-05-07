const BottomNav = ({ page, setPage }) => {
    const tabs = [
        { id: "home", icon: "home", label: "Home" },
        { id: "search", icon: "search", label: "Search" },
        { id: "library", icon: "library_music", label: "Library" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f0f] border-t border-white/5 flex items-center justify-around px-4 pb-6 pt-3">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setPage(tab.id)}
                    className="flex flex-col items-center gap-1"
                >
                    <span className={`material-symbols-outlined !text-[2.8vh] transition-colors ${page === tab.id ? "text-white" : "text-white/30"}`}>
                        {tab.icon}
                    </span>
                    <span className={`text-[1.1vh] transition-colors ${page === tab.id ? "text-white" : "text-white/30"}`}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default BottomNav;