import HrSidebar from "@/components/hrSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <HrSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
