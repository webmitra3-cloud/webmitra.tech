import {
  BarChart3,
  Briefcase,
  Brush,
  Camera,
  Cloud,
  Code2,
  Cpu,
  Database,
  Figma,
  FileText,
  Globe,
  Handshake,
  Layers,
  LayoutPanelTop,
  LineChart,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Target,
  TrendingUp,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type ServiceIconProps = {
  name: string;
  className?: string;
};

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Briefcase,
  Brush,
  Camera,
  Cloud,
  Code2,
  Cpu,
  Database,
  Figma,
  FileText,
  Globe,
  Handshake,
  Layers,
  LayoutPanelTop,
  LineChart,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Target,
  TrendingUp,
  Workflow,
  Wrench,
};

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent className={className} />;
}
