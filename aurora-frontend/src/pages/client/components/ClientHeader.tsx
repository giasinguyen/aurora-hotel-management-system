import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setLanguage } from "@/features/slices/language/languageSlice";
import { logoutAsync, selectAuth } from "@/features/slices/auth/authSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, User, LogOut, Settings, UserCircle } from "lucide-react";
import { toast } from "sonner";

// Language option component
const LanguageOption = ({ value }: { value: string }) => {
  const flags = {
    en: "/src/assets/images/commons/english.png",
    vi: "/src/assets/images/commons/vietnam.png",
  };
  return (
    <img
      src={flags[value as keyof typeof flags]}
      alt="languages"
      className="w-5 h-5 object-cover rounded-sm"
    />
  );
};

export default function ClientHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("header");
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const { isAuthenticated, currentUser } = useAppSelector(selectAuth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { path: "/", label: t("menu.home") },
    { path: "/about", label: t("menu.about") },
    { path: "/accommodation", label: t("menu.accommodation") },
    { path: "/service", label: t("menu.service") },
    { path: "/news", label: t("menu.news") },
    { path: "/gallery", label: t("menu.gallery") },
  ];

  const handleSearchClick = () => {
    console.log("Search clicked");
    // TODO: Implement search functionality
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch {
      toast.error("Có lỗi khi đăng xuất");
    }
  };

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (isScrolled
          ? "bg-white shadow-md translate-y-0"
          : "bg-transparent -translate-y-2")
      }
    >
      {/* Desktop Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-1">
          {/* Logo - Desktop */}
          <Link to="/" className="hidden lg:flex items-center space-x-3">
            <div className="w-28 h-28 flex items-center justify-center">
              <img
                src="/src/assets/images/commons/aurora-logo.png"
                alt="Aurora Hotel"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  "text-sm font-medium tracking-wide transition-all hover:opacity-80 " +
                  (isScrolled ? "text-gray-700" : "text-white/90")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className={
                "p-2.5 rounded-lg transition-all " +
                (isScrolled
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-white/20 text-white hover:bg-white/30")
              }
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Select - Desktop */}
            <Select
              value={currentLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger
                className={
                  "w-auto h-10 rounded-lg px-3 transition-all " +
                  (isScrolled
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                    : "bg-white/20 text-white hover:bg-white/30 border-white/30")
                }
              >
                <LanguageOption value={currentLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <img
                      src="/src/assets/images/commons/english.png"
                      alt="English"
                      className="w-5 h-5 object-cover rounded-sm"
                    />
                    <span>English</span>
                  </div>
                </SelectItem>
                <SelectItem value="vi">
                  <div className="flex items-center gap-2">
                    <img
                      src="/src/assets/images/commons/vietnam.png"
                      alt="Tiếng Việt"
                      className="w-5 h-5 object-cover rounded-sm"
                    />
                    <span>Tiếng Việt</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Auth Buttons or User Menu */}
            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={
                      "flex items-center gap-3 px-3 py-2 rounded-lg h-10 transition-all " +
                      (isScrolled
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-white/20 text-white hover:bg-white/30")
                    }
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold leading-tight">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>{t("user.profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("user.settings")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("user.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 h-10 rounded-lg font-medium text-sm transition-all bg-primary text-white hover:bg-primary/90"
              >
                {t("buttons.login")}
              </button>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between w-full py-6">
            {/* Mobile Menu Button */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <button
                  className={
                    "p-2 transition-colors " +
                    (isScrolled ? "text-gray-700" : "text-white")
                  }
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-6">
                <SheetHeader className="mb-6 p-0">
                  <SheetTitle>{t("navigation.menu")}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation menu for mobile devices
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-5">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={
                        "text-base font-medium transition-colors hover:opacity-80 " +
                        (location.pathname === item.path
                          ? "text-primary"
                          : "text-gray-700")
                      }
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  {/* Language Select - Mobile */}
                  <Select
                    value={currentLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300">
                      <LanguageOption value={currentLanguage} />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200 shadow-lg">
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <img
                            src="/src/assets/images/commons/english.png"
                            alt="English"
                            className="w-5 h-5 object-cover rounded-sm"
                          />
                          <span>English</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vi">
                        <div className="flex items-center gap-2">
                          <img
                            src="/src/assets/images/commons/vietnam.png"
                            alt="Tiếng Việt"
                            className="w-5 h-5 object-cover rounded-sm"
                          />
                          <span>Tiếng Việt</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                   {/* User Menu - Mobile */}
                   {isAuthenticated && currentUser ? (
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                           <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                             <User className="w-5 h-5 text-white" />
                           </div>
                           <div className="flex-1 text-left">
                             <p className="text-sm font-semibold text-gray-900">
                               {currentUser.firstName} {currentUser.lastName}
                             </p>
                             <p className="text-xs text-gray-500">
                               {currentUser.username}
                             </p>
                           </div>
                         </button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="start" className="w-56">
                         <DropdownMenuLabel>
                           <div className="flex flex-col space-y-1">
                             <p className="text-sm font-medium">
                               {currentUser.firstName} {currentUser.lastName}
                             </p>
                             <p className="text-xs text-muted-foreground">
                               {currentUser.username}
                             </p>
                           </div>
                         </DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem
                           onClick={() => {
                             navigate("/profile");
                             setIsDrawerOpen(false);
                           }}
                         >
                           <UserCircle className="mr-2 h-4 w-4" />
                           <span>{t("user.profile")}</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem
                           onClick={() => {
                             navigate("/settings");
                             setIsDrawerOpen(false);
                           }}
                         >
                           <Settings className="mr-2 h-4 w-4" />
                           <span>{t("user.settings")}</span>
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem
                           onClick={() => {
                             handleLogout();
                             setIsDrawerOpen(false);
                           }}
                           className="text-red-600 focus:text-red-600"
                         >
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>{t("user.logout")}</span>
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   ) : (
                     <button
                       onClick={() => {
                         navigate("/login");
                         setIsDrawerOpen(false);
                       }}
                       className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                     >
                       {t("buttons.login")}
                     </button>
                   )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo - Center */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <div className="w-28 h-28 flex items-center justify-center">
                <img
                  src="/src/assets/images/commons/aurora-logo.png"
                  alt="Aurora Hotel"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            {/* Mobile Search Button - Right */}
            <button
              onClick={handleSearchClick}
              className={
                "p-2 transition-colors " +
                (isScrolled ? "text-gray-700" : "text-white")
              }
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
