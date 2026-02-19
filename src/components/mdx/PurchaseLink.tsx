interface PurchaseLinkProps {
  url: string;
  label: string;
}

export default function PurchaseLink({ url, label }: PurchaseLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="purchase-link-button"
    >
      {label}
    </a>
  );
}

