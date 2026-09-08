import {
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Sparkles
} from "lucide-react";

import { useState } from "react";
import { useSSE } from "./hooks/useSseconnection.js";
import { PipelineStep, PipeLine } from "./components/Pipeline.jsx";
import Image from "./components/ImageOutput.jsx";
function App() {

  const [image, setImage] = useState(null);

  const [result, setResults] = useState({
    resize: null,
    compress: null,
    convert: null
  })

  const handleImageChange = async (e) => {
    setImage(e.target?.files[0]);

    const formdata = new FormData();

    formdata.append('image', image);

    return formdata
  }

  const editImage = async () => {
    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: handleImageChange(),
    });
    return response
  }
  const data = editImage().then(res => res.json());

  const jobId = data.jobId

  useSSE(jobId, {
    onStageCompleted(data) { // custom method for the handler object
      setResults(prev => ({
        ...prev,
        [data.stage]: data
      }))
    }
  }) // get data from publisher to the eventsource then useSSE updates result state then show that in the ui

  return (
    <div className="min-h-screen bg-[#050505] text-[#e9e9e9]">

      {/* NAVBAR */}
      <header className="h-19 border-b border-[#202020] bg-[#050505] px-6 md:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#303030] bg-[#101010]">
              <ImageIcon size={16} />
            </div>

            <span className="text-sm font-semibold tracking-wide">
              IMG<span className="text-[#777]">PIPE</span>
            </span>
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center gap-5">
            <button className="hidden text-sm text-[#888] transition hover:text-white sm:block">
              Documentation
            </button>

            {/* <button className="flex items-center gap-2 text-sm text-[#888] transition hover:text-white">
              <Github size={16} />
              <span className="hidden sm:block">GitHub</span>
            </button> */}
          </div>

        </div>
      </header>


      {/* MAIN */}
      <main className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">

        {/* HERO */}
        <section className="text-center">

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Process your images
            <br />
            <span className="text-[#666]">
              through a pipeline.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#777] md:text-base">
            Upload an image and run it through a sequence of
            configurable image processing operations.
          </p>

        </section>


        {/* UPLOAD */}
        <section className="mt-14">

          <div className="group relative rounded-xl border border-[#292929] bg-[#090909] p-2 transition hover:border-[#3a3a3a]">

            <div className="flex min-h-70 flex-col items-center justify-center rounded-lg border border-dashed border-[#292929] px-6 text-center transition group-hover:border-[#444]">

              <div className="mt-6 flex items-center gap-2 rounded-md border border-[#303030] bg-[#f2f2f2] p-3 text-xs font-medium text-black transition hover:bg-white">
                <Upload size={14} />
                <input type="file" onChange={handleImageChange} />
              </div>

              <p className="mt-4 text-[11px] text-[#555]">
                PNG, JPG, JPEG, WEBP · Max 10MB
              </p>

              <button
                onClick={editImage}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all duration-200 hover:bg-[#e2e2e2] hover:shadow-[0_0_25px_rgba(255,255,255,0.22)] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Start Editing</span>
              </button>

            </div>
          </div>

        </section>


        {/* PIPELINE */}
        <section className="mt-12">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#555]">
                Pipeline
              </p>

              <h2 className="mt-1 text-sm font-medium">
                Processing stages
              </h2>
            </div>

            <span className="text-xs text-[#555]">
              5 stages
            </span>
          </div>


          <div className="overflow-x-auto rounded-xl border border-[#242424] bg-[#090909] p-5">

            <div className="flex min-w-162.5 items-center">

              <PipelineStep
                number="01"
                name="Upload"
                description="Input"
                active
              />

              <PipeLine />

              <PipelineStep
                number="02"
                name="Resize"
                description="Transform"
              />
              {result.resize && (
                <Image stage={result.resize} />
              )}
              <PipeLine />

              <PipelineStep
                number="03"
                name="Compress"
                description="compress"
              />
              {result.compress && (
                <Image stage={result.compress} />
              )}
              <PipeLine />

              <PipelineStep
                number="04"
                name="Convert"
                description="convert"
              />
              {result.convert && (
                <Image stage={result.convert} />
              )}
            </div>

          </div>

        </section>


        {/* ACTION */}
        <section className="mt-10 flex justify-center">

          <button
            disabled
            className="flex cursor-not-allowed items-center gap-2 rounded-md bg-[#181818] px-5 py-3 text-sm font-medium text-[#555]"
          >
            Start Processing
            <ChevronRight size={16} />
          </button>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="border-t border-[#181818] px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] text-[#444]">
          <span>IMGPIPE</span>
          <span>Image Processing Pipeline</span>
        </div>
      </footer>

    </div>
  );
}

export default App
