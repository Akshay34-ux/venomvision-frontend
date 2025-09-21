import { Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n"; // ✅ keep this one
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  showLanguageToggle?: boolean;
  title?: string;
  tagline?: string;
}

export const Header = ({
  showLanguageToggle = true,
  title = "VenomVision",
  tagline,
}: HeaderProps) => {
  const { t } = useTranslation(); // ✅ only use t

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-medium">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              {tagline && (
                <p className="text-sm text-muted-foreground">{tagline}</p>
              )}
            </div>
          </div>

          {showLanguageToggle && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select
                value={i18n.language || "en"}
                onValueChange={(lng) => i18n.changeLanguage(lng)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};