function Image({ stage }) {
    if (!stage) return null;

    const downloadUrl = stage.downloadUrl || stage.imageUrl;

    return (
        <div className="mx-2 flex flex-col items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#101010] p-2 text-center shadow-sm">
            <img 
                src={stage.imageUrl} 
                alt={stage.stage || "preview"} 
                className="h-16 w-16 rounded object-cover border border-[#222]" 
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />
            <a 
                href={downloadUrl} 
                download
                className="inline-flex items-center gap-1 rounded bg-[#202020] px-2 py-0.5 text-[10px] font-medium text-[#ccc] transition hover:bg-[#333] hover:text-white"
            >
                Download
            </a>
        </div>
    );
}

export default Image