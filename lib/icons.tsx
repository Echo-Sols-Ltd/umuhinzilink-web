'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
Activity as ActivitySvg,
AlertCircle as AlertCircleSvg,
AlertTriangle as AlertTriangleSvg,
ArrowDownLeft as ArrowDownLeftSvg,
ArrowLeft as ArrowLeftSvg,
ArrowRight as ArrowRightSvg,
ArrowUpDown as ArrowUpDownSvg,
ArrowUpRight as ArrowUpRightSvg,
Award as AwardSvg,
Banknote as BanknoteSvg,
BarChartIcon as BarChartIconSvg,
Bell as BellSvg,
Brain as BrainSvg,
Briefcase as BriefcaseSvg,
Building as BuildingSvg,
Calculator as CalculatorSvg,
Calendar as CalendarSvg,
CalendarIcon as CalendarIconSvg,
Camera as CameraSvg,
Check as CheckSvg,
CheckCheck as CheckCheckSvg,
CheckCircle as CheckCircleSvg,
CheckIcon as CheckIconSvg,
ChevronDown as ChevronDownSvg,
ChevronDownIcon as ChevronDownIconSvg,
ChevronLeft as ChevronLeftSvg,
ChevronLeftIcon as ChevronLeftIconSvg,
ChevronRight as ChevronRightSvg,
ChevronRightIcon as ChevronRightIconSvg,
ChevronUpIcon as ChevronUpIconSvg,
ClipboardList as ClipboardListSvg,
Clock as ClockSvg,
CornerUpLeft as CornerUpLeftSvg,
CreditCard as CreditCardSvg,
DollarSign as DollarSignSvg,
Download as DownloadSvg,
Edit as EditSvg,
Eye as EyeSvg,
EyeOff as EyeOffSvg,
File as FileSvg,
FileText as FileTextSvg,
Filter as FilterSvg,
Globe as GlobeSvg,
Heart as HeartSvg,
History as HistorySvg,
Home as HomeSvg,
ImageIcon as ImageIconSvg,
ImagePlus as ImagePlusSvg,
Info as InfoSvg,
Languages as LanguagesSvg,
LayoutDashboard as LayoutDashboardSvg,
LayoutGrid as LayoutGridSvg,
Leaf as LeafSvg,
List as ListSvg,
Loading03Icon as Loading03IconSvg,
Lock as LockSvg,
LogOut as LogOutSvg,
Mail as MailSvg,
MapPin as MapPinSvg,
Megaphone as MegaphoneSvg,
Menu as MenuSvg,
MessageCircle as MessageCircleSvg,
MessageSquare as MessageSquareSvg,
Minus as MinusSvg,
Monitor as MonitorSvg,
Moon as MoonSvg,
MoreVertical as MoreVerticalSvg,
Package as PackageSvg,
Paperclip as PaperclipSvg,
PauseCircleIcon as PauseCircleIconSvg,
PencilEdit02Icon as PencilEdit02IconSvg,
PencilEditIcon as PencilEditIconSvg,
Phone as PhoneSvg,
Plus as PlusSvg,
RefreshCw as RefreshCwSvg,
Ruler as RulerSvg,
Save as SaveSvg,
Search as SearchSvg,
Send as SendSvg,
Settings as SettingsSvg,
Share2 as Share2Svg,
Shield as ShieldSvg,
ShieldCheck as ShieldCheckSvg,
ShoppingBag as ShoppingBagSvg,
ShoppingCart as ShoppingCartSvg,
Signal as SignalSvg,
Smartphone as SmartphoneSvg,
Sprout as SproutSvg,
Store as StoreSvg,
Sun as SunSvg,
ThumbsDown as ThumbsDownSvg,
ThumbsUp as ThumbsUpSvg,
ToggleLeft as ToggleLeftSvg,
ToggleRight as ToggleRightSvg,
Trash2 as Trash2Svg,
TrendingDown as TrendingDownSvg,
TrendingUp as TrendingUpSvg,
Truck as TruckSvg,
UnavailableIcon as UnavailableIconSvg,
Upload as UploadSvg,
User as UserSvg,
UserCheck as UserCheckSvg,
UserIcon as UserIconSvg,
UserX as UserXSvg,
Users as UsersSvg,
Wallet as WalletSvg,
WheatIcon as WheatIconSvg,
Wifi as WifiSvg,
WifiOff as WifiOffSvg,
X as XSvg,
XCircle as XCircleSvg
} from '@hugeicons/core-free-icons';

export type IconProps = {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  color?: string;
};

function createIcon(icon: IconSvgElement) {
  return function Icon({ size = 24, className, strokeWidth = 1.5, color }: IconProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={size}
        className={className}
        strokeWidth={strokeWidth}
        color={color ?? 'currentColor'}
      />
    );
  };
}


export const Activity = createIcon(ActivitySvg);
export const AlertCircle = createIcon(AlertCircleSvg);
export const AlertTriangle = createIcon(AlertTriangleSvg);
export const ArrowDownLeft = createIcon(ArrowDownLeftSvg);
export const ArrowLeft = createIcon(ArrowLeftSvg);
export const ArrowRight = createIcon(ArrowRightSvg);
export const ArrowUpDown = createIcon(ArrowUpDownSvg);
export const ArrowUpRight = createIcon(ArrowUpRightSvg);
export const Award = createIcon(AwardSvg);
export const Ban = createIcon(UnavailableIconSvg);
export const Banknote = createIcon(BanknoteSvg);
export const BarChart2 = createIcon(BarChartIconSvg);
export const BarChart3 = createIcon(BarChartIconSvg);
export const Bell = createIcon(BellSvg);
export const Brain = createIcon(BrainSvg);
export const Briefcase = createIcon(BriefcaseSvg);
export const Building = createIcon(BuildingSvg);
export const Calculator = createIcon(CalculatorSvg);
export const Calendar = createIcon(CalendarSvg);
export const CalendarIcon = createIcon(CalendarIconSvg);
export const Camera = createIcon(CameraSvg);
export const Check = createIcon(CheckSvg);
export const CheckCheck = createIcon(CheckCheckSvg);
export const CheckCircle = createIcon(CheckCircleSvg);
export const CheckIcon = createIcon(CheckIconSvg);
export const ChevronDown = createIcon(ChevronDownSvg);
export const ChevronDownIcon = createIcon(ChevronDownIconSvg);
export const ChevronLeft = createIcon(ChevronLeftSvg);
export const ChevronLeftIcon = createIcon(ChevronLeftIconSvg);
export const ChevronRight = createIcon(ChevronRightSvg);
export const ChevronRightIcon = createIcon(ChevronRightIconSvg);
export const ChevronUpIcon = createIcon(ChevronUpIconSvg);
export const ClipboardList = createIcon(ClipboardListSvg);
export const Clock = createIcon(ClockSvg);
export const CornerUpLeft = createIcon(CornerUpLeftSvg);
export const CreditCard = createIcon(CreditCardSvg);
export const DollarSign = createIcon(DollarSignSvg);
export const Download = createIcon(DownloadSvg);
export const Edit = createIcon(EditSvg);
export const Edit2 = createIcon(PencilEdit02IconSvg);
export const Edit3 = createIcon(PencilEditIconSvg);
export const Eye = createIcon(EyeSvg);
export const EyeOff = createIcon(EyeOffSvg);
export const File = createIcon(FileSvg);
export const FileText = createIcon(FileTextSvg);
export const Filter = createIcon(FilterSvg);
export const Globe = createIcon(GlobeSvg);
export const Heart = createIcon(HeartSvg);
export const History = createIcon(HistorySvg);
export const Home = createIcon(HomeSvg);
export const ImageIcon = createIcon(ImageIconSvg);
export const ImagePlus = createIcon(ImagePlusSvg);
export const Info = createIcon(InfoSvg);
export const Languages = createIcon(LanguagesSvg);
export const LayoutDashboard = createIcon(LayoutDashboardSvg);
export const LayoutGrid = createIcon(LayoutGridSvg);
export const Leaf = createIcon(LeafSvg);
export const List = createIcon(ListSvg);
export const Loader2 = createIcon(Loading03IconSvg);
export const Lock = createIcon(LockSvg);
export const LogOut = createIcon(LogOutSvg);
export const Mail = createIcon(MailSvg);
export const MapPin = createIcon(MapPinSvg);
export const Megaphone = createIcon(MegaphoneSvg);
export const Menu = createIcon(MenuSvg);
export const MessageCircle = createIcon(MessageCircleSvg);
export const MessageSquare = createIcon(MessageSquareSvg);
export const Minus = createIcon(MinusSvg);
export const Monitor = createIcon(MonitorSvg);
export const Moon = createIcon(MoonSvg);
export const MoreVertical = createIcon(MoreVerticalSvg);
export const Package = createIcon(PackageSvg);
export const Paperclip = createIcon(PaperclipSvg);
export const PauseCircle = createIcon(PauseCircleIconSvg);
export const Phone = createIcon(PhoneSvg);
export const Plus = createIcon(PlusSvg);
export const RefreshCw = createIcon(RefreshCwSvg);
export const Ruler = createIcon(RulerSvg);
export const Save = createIcon(SaveSvg);
export const Search = createIcon(SearchSvg);
export const Send = createIcon(SendSvg);
export const Settings = createIcon(SettingsSvg);
export const Share2 = createIcon(Share2Svg);
export const Shield = createIcon(ShieldSvg);
export const ShieldCheck = createIcon(ShieldCheckSvg);
export const ShoppingBag = createIcon(ShoppingBagSvg);
export const ShoppingCart = createIcon(ShoppingCartSvg);
export const Signal = createIcon(SignalSvg);
export const Smartphone = createIcon(SmartphoneSvg);
export const Sprout = createIcon(SproutSvg);
export const Store = createIcon(StoreSvg);
export const Sun = createIcon(SunSvg);
export const ThumbsDown = createIcon(ThumbsDownSvg);
export const ThumbsUp = createIcon(ThumbsUpSvg);
export const ToggleLeft = createIcon(ToggleLeftSvg);
export const ToggleRight = createIcon(ToggleRightSvg);
export const Trash2 = createIcon(Trash2Svg);
export const TrendingDown = createIcon(TrendingDownSvg);
export const TrendingUp = createIcon(TrendingUpSvg);
export const Truck = createIcon(TruckSvg);
export const Upload = createIcon(UploadSvg);
export const User = createIcon(UserSvg);
export const UserCheck = createIcon(UserCheckSvg);
export const UserIcon = createIcon(UserIconSvg);
export const UserX = createIcon(UserXSvg);
export const Users = createIcon(UsersSvg);
export const Wallet = createIcon(WalletSvg);
export const Wheat = createIcon(WheatIconSvg);
export const Wifi = createIcon(WifiSvg);
export const WifiOff = createIcon(WifiOffSvg);
export const X = createIcon(XSvg);
export const XCircle = createIcon(XCircleSvg);
