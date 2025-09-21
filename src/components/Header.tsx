import { Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { i18n } = useTranslation();

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
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

          {/* 🌍 Language Toggle */}
          {showLanguageToggle && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select
                defaultValue={i18n.language || "en"}
                onValueChange={(lng) => i18n.changeLanguage(lng)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
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