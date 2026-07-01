interface SpriteIconProps {
  id: string;
  className: string;
}

export function SpriteIcon({ id, className }: SpriteIconProps) {
  return (
    <svg className={className}>
      <use href={`/assets/icons/sprite.svg#${id}`} />
    </svg>
  );
}
