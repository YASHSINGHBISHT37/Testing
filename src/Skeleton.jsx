const Skeleton = ({ className }) => (
    <div
        className={`rounded-xl ${className}`}
        style={{
            background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
        }}
    />
);

export const HomeSkeleton = () => (
    <div className="bg-[#0f0f0f] min-h-screen pb-32 text-white px-4 pt-20">
        <Skeleton className="w-40 h-7 mb-8" />
        <Skeleton className="w-32 h-5 mb-4" />
        <div className="flex flex-col gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 flex-shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="w-40 h-4" />
                        <Skeleton className="w-24 h-3" />
                    </div>
                </div>
            ))}
        </div>
        <Skeleton className="w-32 h-5 mb-4" />
        <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0">
                    <Skeleton className="w-36 h-36 mb-2" />
                    <Skeleton className="w-28 h-4 mb-1" />
                    <Skeleton className="w-20 h-3" />
                </div>
            ))}
        </div>
    </div>
);

export const ArtistSkeleton = () => (
    <div className="bg-[#121212] min-h-screen text-white">
        <Skeleton className="w-full h-72 rounded-none" />
        <div className="px-4 mt-4 flex flex-col gap-3">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-4" />
            <div className="flex gap-3 mt-4">
                <Skeleton className="w-28 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>
        </div>
        <div className="px-4 mt-8 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 flex-shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="w-40 h-4" />
                        <Skeleton className="w-24 h-3" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const AlbumSkeleton = () => (
    <div className="bg-[#121212] min-h-screen text-white flex flex-col items-center pt-20 px-4">
        <Skeleton className="w-52 h-52 mb-4" />
        <Skeleton className="w-40 h-6 mb-2" />
        <Skeleton className="w-28 h-4 mb-8" />
        <div className="w-full flex flex-col gap-3">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-4" />
                    <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="w-40 h-4" />
                        <Skeleton className="w-24 h-3" />
                    </div>
                    <Skeleton className="w-10 h-3" />
                </div>
            ))}
        </div>
    </div>
);

export default Skeleton;