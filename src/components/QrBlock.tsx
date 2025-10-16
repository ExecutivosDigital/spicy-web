export function QrBlock({ dataUrl }: { dataUrl?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <img
          src={dataUrl || ""}
          alt="QR Code do Pix"
          className="h-[240px] w-[240px] object-contain sm:h-[280px] sm:w-[280px]"
        />
      </div>
      <p className="text-xs text-neutral-500">
        Aponte a câmera do banco para o QR Code
      </p>
    </div>
  );
}
