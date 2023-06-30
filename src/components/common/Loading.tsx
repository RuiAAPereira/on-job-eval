export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-950/80 outline-none  focus:outline-none">
      <div className="h-24 w-24 animate-spin  rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
    </div>
  );
}
