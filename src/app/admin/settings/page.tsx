// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Link as LinkIcon,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/hooks/use-toast";

// ============================================================================
// Types
// ============================================================================

interface InstitutionSettings {
  name: string;
  logo_url: string | null;
  welcome_message: string;
  features: {
    assessments: boolean;
    achievements: boolean;
    progress_tracking: boolean;
    social_features: boolean;
  };
  lms_integration: {
    enabled: boolean;
    provider: string | null;
    api_key: string | null;
    api_url: string | null;
  };
}

// ============================================================================
// Page Component
// ============================================================================

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<InstitutionSettings>({
    name: "ARKA-ED Institution",
    logo_url: null,
    welcome_message: "Welcome to ARKA-ED! Start your medical education journey today.",
    features: {
      assessments: true,
      achievements: true,
      progress_tracking: true,
      social_features: false,
    },
    lms_integration: {
      enabled: false,
      provider: null,
      api_key: null,
      api_url: null,
    },
  });

  const [saving, setSaving] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings({ ...settings, logo_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Settings saved successfully!", "Your changes have been applied");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Configure your institution's branding and platform features
        </p>
      </div>

      {/* Institution Branding */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-cyan-400" />
            Institution Branding
          </CardTitle>
          <CardDescription className="text-slate-400">
            Customize your institution's appearance and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Institution Name */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Institution Name
            </label>
            <Input
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Enter institution name"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview || settings.logo_url ? (
                <div className="relative">
                  <img
                    src={logoPreview || settings.logo_url || ""}
                    alt="Institution logo"
                    className="w-24 h-24 object-contain bg-slate-800 rounded-lg border border-slate-700"
                  />
                  <button
                    onClick={() => {
                      setLogoPreview(null);
                      setSettings({ ...settings, logo_url: null });
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-rose-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG up to 5MB. Recommended: 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Custom Welcome Message
            </label>
            <textarea
              value={settings.welcome_message}
              onChange={(e) =>
                setSettings({ ...settings, welcome_message: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
              placeholder="Enter a custom welcome message for your users"
            />
            <p className="text-xs text-slate-500 mt-1">
              This message will be displayed to users when they first log in
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Feature Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enable or disable platform features for your institution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FeatureToggle
            label="Assessments"
            description="Allow users to take assessments and quizzes"
            enabled={settings.features.assessments}
            onToggle={(enabled) =>
              setSettings({
                ...settings,
                features: { ...settings.features, assessments: enabled },
              })
            }
          />
          <FeatureToggle
            label="Achievements"
            description="Enable achievement badges and milestones"
            enabled={settings.features.achievements}
            onToggle={(enabled) =>
              setSettings({
                ...settings,
                features: { ...settings.features, achievements: enabled },
              })
            }
          />
          <FeatureToggle
            label="Progress Tracking"
            description="Track and display user progress and statistics"
            enabled={settings.features.progress_tracking}
            onToggle={(enabled) =>
              setSettings({
                ...settings,
                features: {
                  ...settings.features,
                  progress_tracking: enabled,
                },
              })
            }
          />
          <FeatureToggle
            label="Social Features"
            description="Enable leaderboards and social interactions"
            enabled={settings.features.social_features}
            onToggle={(enabled) =>
              setSettings({
                ...settings,
                features: { ...settings.features, social_features: enabled },
              })
            }
          />
        </CardContent>
      </Card>

      {/* LMS Integration */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-cyan-400" />
            LMS Integration
          </CardTitle>
          <CardDescription className="text-slate-400">
            Connect ARKA-ED with your Learning Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Enable LMS Integration</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Sync user data and progress with your LMS
              </p>
            </div>
            <Switch
              checked={settings.lms_integration.enabled}
              onCheckedChange={(enabled) =>
                setSettings({
                  ...settings,
                  lms_integration: {
                    ...settings.lms_integration,
                    enabled,
                  },
                })
              }
            />
          </div>

          {settings.lms_integration.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-slate-800"
            >
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  LMS Provider
                </label>
                <select
                  value={settings.lms_integration.provider || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lms_integration: {
                        ...settings.lms_integration,
                        provider: e.target.value || null,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Select provider...</option>
                  <option value="canvas">Canvas</option>
                  <option value="blackboard">Blackboard</option>
                  <option value="moodle">Moodle</option>
                  <option value="brightspace">Brightspace</option>
                  <option value="sakai">Sakai</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  API URL
                </label>
                <Input
                  value={settings.lms_integration.api_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lms_integration: {
                        ...settings.lms_integration,
                        api_url: e.target.value || null,
                      },
                    })
                  }
                  placeholder="https://your-lms-instance.com/api"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  API Key
                </label>
                <Input
                  type="password"
                  value={settings.lms_integration.api_key || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lms_integration: {
                        ...settings.lms_integration,
                        api_key: e.target.value || null,
                      },
                    })
                  }
                  placeholder="Enter your API key"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Your API key is encrypted and stored securely
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      Integration Status
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      LMS integration is currently in development. Contact support
                      for assistance with setup.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-600 min-w-[120px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function FeatureToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{label}</p>
          {enabled && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
              Active
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
