export function CopyBlock({
  copyAndPaste,
  copied,
  onCopy,
  modelName,
}: {
  copyAndPaste?: string;
  copied?: boolean;
  onCopy?: () => void;
  modelName: string;
}) {
  return (
    <>
      <div className="grid gap-2">
        <label className="text-[12px] tracking-wide text-neutral-500">
          Código Pix (copia e cola)
        </label>
        <div className="relative">
          <textarea
            readOnly
            value={copyAndPaste || ""}
            className="min-h-[92px] w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-[13px] leading-relaxed outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={onCopy}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-black text-white"
        >
          {copied ? "Copiado ✓" : `Copiar Pix`}
        </button>
      </div>
    </>
  );
}
