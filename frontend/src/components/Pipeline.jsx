// each editing step
function PipelineStep({
    number,
    name,
    description,
    active = false
}) {
    return (
        <div className="flex min-w-26.25 flex-col items-center text-center">

            <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-medium ${active
                    ? "border-white bg-white text-black"
                    : "border-[#333] bg-[#111] text-[#666]"
                    }`}
            >
                {number}
            </div>

            <p
                className={`mt-3 text-xs font-medium ${active ? "text-white" : "text-[#777]"
                    }`}
            >
                {name}
            </p>

            <p className="mt-1 text-[10px] text-[#444]">
                {description}
            </p>

        </div>
    );
}
// arrow 
function PipeLine() {
    return (
        <div className="mb-8 h-px flex-1 bg-[#292929]" />
    );
}

export { PipelineStep, PipeLine }