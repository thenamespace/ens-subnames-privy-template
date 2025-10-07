import { ArrowRightIcon } from "@heroicons/react/16/solid";

export function Header() {
  return (
    <header className="h-[60px] flex flex-row justify-between items-center px-6 border-b bg-white border-[#E2E3F0]">
      <div className="flex flex-row items-center gap-2 h-[26px]">
        <h1 className="text-xl font-abc-favorit font-medium">Dashboard</h1>
      </div>

      <div className="flex flex-row justify-end items-center gap-4 h-9">
        <button className="button-primary rounded-full">
          <a
            className="flex flex-row items-center gap-2"
            href="/dashboard"
          >
            <span>Dashboard</span>
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
          </a>
        </button>
      </div>
    </header>
  );
}
