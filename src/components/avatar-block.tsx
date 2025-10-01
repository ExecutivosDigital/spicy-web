export function AvatarGroup({ urls = [] as string[] }) {
  if (!urls.length) {
    return (
      <div className="flex -space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 w-12 min-w-12 rounded-full bg-neutral-200 ring-2 ring-white"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex -space-x-2">
      {urls.slice(0, 3).map((u, i) => (
        <img
          key={i}
          src={u}
          alt=""
          className="h-12 w-12 min-w-12 rounded-full object-cover ring-2 ring-white"
        />
      ))}
    </div>
  );
}
