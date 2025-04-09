
import { Header } from "@/_components/Header";
import { ClientOnly } from "../_components/common/ClientOnly";
import Provider from "@/provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly>
      <div className="min-h-screen   bg-transparent flex-col font-normal dark:text-white ">
        <Header />
        <Provider><main className=" w-[100%] flex-col items-center p-4 mx-auto">
          {children}
        </main></Provider>
      </div>
    </ClientOnly>
  );
}
