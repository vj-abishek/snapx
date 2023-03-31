export default function VideoLoading() {
  const times = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {times.map((_, i) => (
        <div key={`LOADING_${i}`}>
          <div className="animate-pulse">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-primary-700"></div>
            <div className="flex flex-row px-2 py-3">
              <div style={{ flexBasis: 50 }}>
                <div className="h-12 w-12 rounded-full bg-primary-700"></div>
              </div>
              <div className="w-full">
                <div className=" ml-3 h-4 w-10/12 rounded-lg bg-primary-700"></div>
                <div className="ml-3 mt-3 h-3 w-1/2 rounded-lg bg-primary-700"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
