import { useEffect } from "react";


export const useSSE = (jobId, handlers) => {
    useEffect(() => {
        if (!jobId) return;

        const eventSource = new EventSource(
            `http://localhost:5000/events/${jobId}`
        ); // initiate the sse connection

        eventSource.addEventListener("stage_completed", async (event) => {
            const data = JSON.parse(event.data);

            await handlers.onStageCompleted?.(data);

        });

        eventSource.onerror = () => {
            console.log("SSE connection error");
        };

        return () => {
            eventSource.close();
        };

    }, [jobId]);

}