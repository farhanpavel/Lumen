"use client";
import CodeEditor from "@/components/ui/CodeEditor";

const Page = ({ params }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f0ff]">
      <div className="h-screen">
        <CodeEditor jobId={params.id} />
      </div>
    </div>
  );
};

export default Page;
