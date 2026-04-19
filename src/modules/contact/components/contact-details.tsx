import type { Contact } from "#/types/contact";
import clsx from "clsx";
import {
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

interface ContactDetailsProps {
  contact: Contact;
  onClose?: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
  isLink = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  isLink?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-3 py-3 group">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div
          className={clsx(
            "font-mono break-all text-foreground",
            isLink && "text-primary hover:underline cursor-pointer flex items-center gap-1"
          )}
        >
          {value}
          {isLink && <ExternalLink className="w-3 h-3 opacity-50" />}
        </div>
      </div>
    </div>
  );

  if (isLink && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const fullAddress = `${contact.address.street}, ${contact.address.suite}, ${contact.address.city} ${contact.address.zipcode}`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="font-mono text-sm text-muted-foreground flex items-center gap-2">
            <span className="text-primary">~</span>
            viewing profile
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-3xl font-mono text-primary-foreground font-bold">
                  {initials}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans text-foreground mb-1">
                {contact.name}
              </h2>
              <div className="text-muted-foreground font-mono flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-primary">@</span>
                {contact.username.toLowerCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                contact info
              </h3>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="space-y-1 bg-secondary/30 rounded-xl p-4">
              <InfoRow
                icon={Mail}
                label="Email"
                value={contact.email.toLowerCase()}
                href={`mailto:${contact.email}`}
                isLink
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={contact.phone}
                href={`tel:${contact.phone}`}
                isLink
              />
              <InfoRow
                icon={Globe}
                label="Website"
                value={contact.website}
                href={`https://${contact.website}`}
                isLink
              />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                company
              </h3>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-0.5">
                    Organization
                  </div>
                  <div className="font-sans text-lg text-foreground">
                    {contact.company.name}
                  </div>
                </div>
              </div>
              <div className="pl-12 border-l-2 border-primary/20 ml-4">
                <div className="mb-3">
                  <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-1">
                    Catchphrase
                  </div>
                  <div className="font-mono text-sm italic text-foreground/80">
                    {`"${contact.company.catchPhrase}"`}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-1">
                    Business
                  </div>
                  <div className="font-mono text-sm text-foreground/80">
                    {contact.company.bs}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                location
              </h3>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-0.5">
                    Address
                  </div>
                  <div className="font-mono text-foreground">
                    {fullAddress}
                  </div>
                </div>
              </div>
              <div className="pl-12 ml-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-mono text-muted-foreground">
                  <span className="text-primary">coords:</span>
                  {contact.address.geo.lat}, {contact.address.geo.lng}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
