import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Settings, ChevronDown, ChevronUp, X } from "lucide-react";
import { Link } from "wouter";

const COOKIE_CONSENT_KEY = "adminbloc_cookie_consent";
const COOKIE_CONSENT_VERSION = "1.0";

interface CookiePreferences {
  version: string;
  timestamp: string;
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

function getStoredConsent(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as CookiePreferences;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(prefs: CookiePreferences) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const consent: CookiePreferences = {
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    };
    saveConsent(consent);
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const consent: CookiePreferences = {
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
    };
    saveConsent(consent);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    const consent: CookiePreferences = {
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      preferences,
      statistics,
      marketing,
    };
    saveConsent(consent);
    setVisible(false);
  }, [preferences, statistics, marketing]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none" data-testid="cookie-consent-overlay">
      <div className="pointer-events-auto w-full max-w-2xl mb-4 mx-4">
        <Card className="p-0 shadow-2xl border-2" data-testid="cookie-consent-banner">
          <div className="p-4 pb-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1" data-testid="text-cookie-title">
                  Acest site foloseste cookie-uri
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Folosim cookie-uri pentru a asigura functionarea corecta a site-ului si pentru a imbunatati experienta dvs. de navigare.
                  Cookie-urile necesare sunt esentiale si nu pot fi dezactivate. Celelalte categorii de cookie-uri sunt optionale.
                  Pentru detalii, consultati{" "}
                  <Link href="/gdpr/politica-cookies" className="underline text-primary hover:text-primary/80" data-testid="link-cookie-policy">
                    Politica de Cookies
                  </Link>{" "}
                  si{" "}
                  <Link href="/gdpr/politica-prelucrare-date" className="underline text-primary hover:text-primary/80" data-testid="link-privacy-policy">
                    Politica de Confidentialitate
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="px-4 pb-3 space-y-3 border-t pt-3" data-testid="cookie-details-section">
              <div className="flex items-center justify-between gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <Label className="text-xs font-semibold">Cookie-uri necesare</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Esentiale pentru functionarea site-ului. Nu pot fi dezactivate.
                  </p>
                </div>
                <Switch checked={true} disabled data-testid="switch-necessary" />
              </div>

              <div className="flex items-center justify-between gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="pref-switch" className="text-xs font-semibold cursor-pointer">Cookie-uri de preferinta</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Permit site-ului sa retina alegerile dvs. (limba, regiune, tema).
                  </p>
                </div>
                <Switch
                  id="pref-switch"
                  checked={preferences}
                  onCheckedChange={setPreferences}
                  data-testid="switch-preferences"
                />
              </div>

              <div className="flex items-center justify-between gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="stats-switch" className="text-xs font-semibold cursor-pointer">Cookie-uri statistice</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Ne ajuta sa intelegem cum navigati pe site pentru a imbunatati performanta.
                  </p>
                </div>
                <Switch
                  id="stats-switch"
                  checked={statistics}
                  onCheckedChange={setStatistics}
                  data-testid="switch-statistics"
                />
              </div>

              <div className="flex items-center justify-between gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="marketing-switch" className="text-xs font-semibold cursor-pointer">Cookie-uri de marketing</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Folosite pentru a va oferi continut si reclame relevante.
                  </p>
                </div>
                <Switch
                  id="marketing-switch"
                  checked={marketing}
                  onCheckedChange={setMarketing}
                  data-testid="switch-marketing"
                />
              </div>
            </div>
          )}

          <div className="px-4 pb-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => setShowDetails(!showDetails)}
              data-testid="button-cookie-settings"
            >
              <Settings className="w-3.5 h-3.5" />
              Personalizare
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>

            {showDetails && (
              <Button
                size="sm"
                className="text-xs"
                onClick={handleSavePreferences}
                data-testid="button-cookie-save"
              >
                Salveaza preferintele
              </Button>
            )}

            <div className="flex-1" />

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleRejectAll}
              data-testid="button-cookie-reject"
            >
              Doar necesare
            </Button>
            <Button
              size="sm"
              className="text-xs"
              onClick={handleAcceptAll}
              data-testid="button-cookie-accept"
            >
              Accepta toate
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
