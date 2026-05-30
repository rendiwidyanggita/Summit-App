export default function Loading() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-12">
      <div className="text-center">
        <div className="mx-auto size-10 animate-pulse rounded-md bg-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Memuat Summit Gear...</p>
      </div>
    </div>
  );
}
