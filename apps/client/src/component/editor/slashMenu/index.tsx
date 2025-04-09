import { SlashCmd } from "@harshtalks/slash-tiptap";
import suggestions from "./suggestions";

export default function SlashMenu() {
  return (
    <SlashCmd.Root editor={null}>
      <SlashCmd.Cmd>
        <SlashCmd.List className="shadow-md scrollbar-thin rounded-md w-[200px] max-h-[200px] min-h-[200px] overflow-y-auto py-2 bg-white border px-1">
          <SlashCmd.Empty>No commands available</SlashCmd.Empty>
          {suggestions.map((item) => {
            return (
              <SlashCmd.Item
                className="hover:bg-slate-400/20 aria-selected:bg-slate-400/20 text-gray-500  aria-selected:text-black  aria-selected:font-bold "
                value={item.title}
                onCommand={(val) => {
                  item.command(val);
                }}
                key={item.title}
              >
                <section className="w-full text-[18px]  cursor-pointer   py-1 flex gap-2">
                  <span className="text-start px-2 py-1 flex">
                    {item.icon && item.icon}
                  </span>{" "}
                  <span>{item.title}</span>
                </section>
              </SlashCmd.Item>
            );
          })}
        </SlashCmd.List>
      </SlashCmd.Cmd>
    </SlashCmd.Root>
  );
}
