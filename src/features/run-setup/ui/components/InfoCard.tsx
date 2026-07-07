interface InfoCardProps {
  title: string;
  description: React.ReactNode;
}

export function InfoCard({ title, description }: InfoCardProps) {
  return (
    <article className="w-sm p-4 space-y-2 rounded-xl border border-decore bg-light">
      <h3 className="font-medium uppercase">{title}</h3>
      <div className="text-pale">{description}</div>
    </article>
  );
}
