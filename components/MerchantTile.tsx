import { cn } from "@/lib/cn";

// Stand-in for a real merchant logo: a monogram on a brand-tinted tile.
// Tints stay in the blue/navy family — green is reserved for verification.
const TINTS = [
  "bg-blue-50 text-blue-700",
  "bg-navy-100 text-navy-700",
  "bg-blue-100 text-blue-800",
  "bg-navy-50 text-navy-600",
];

export function MerchantTile({
  name,
  logo,
  size = 44,
  className,
}: {
  name: string | null;
  logo?: string;
  size?: number;
  className?: string;
}) {
  const label = name ?? "?";
  const tint = TINTS[label.charCodeAt(0) % TINTS.length];
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-display font-bold overflow-hidden shrink-0",
        !logo && tint,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="w-full h-full object-contain" />
      ) : (
        label.slice(0, 1).toUpperCase()
      )}
    </div>
  );
}
