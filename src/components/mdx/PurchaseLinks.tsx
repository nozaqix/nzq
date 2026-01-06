interface PurchaseLink {
  url: string;
  label: string;
}

interface PurchaseLinksProps {
  links: PurchaseLink[];
}

export default function PurchaseLinks({ links }: PurchaseLinksProps) {
  return (
    <div className="purchase-links-container">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="purchase-link-button"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

