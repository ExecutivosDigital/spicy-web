import { useRouter } from "next/navigation";

const MyProfileHeader = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between p-2">
        <div className="flex gap-3 lg:gap-2 xl:gap-3">
          <span className="text-sm font-semibold xl:text-lg">Mensagens</span>
        </div>
      </div>
    </>
  );
};

export default MyProfileHeader;
