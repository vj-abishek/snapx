import * as Avatar from "@radix-ui/react-avatar";

interface AvatarProps {
  src?: string | null;
  alt?: string | null;
}

export default function Image({ src, alt }: AvatarProps) {
  return (
    <Avatar.Root className="AvatarRoot flex-shrink-0">
      <Avatar.Image
        className="AvatarImage"
        src={src || undefined}
        alt={alt || "User avatar"}
      />
      <Avatar.Fallback
        className="AvatarFallback bg-primary-400 text-primary-800"
        delayMs={600}
      >
        {alt && alt?.slice(0, 2)?.toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
