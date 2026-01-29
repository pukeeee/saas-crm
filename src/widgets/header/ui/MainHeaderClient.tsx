"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { useAuthModal } from "@/shared/stores/use-auth-modal.store";
import { AuthenticatedUser } from "@/widgets/header/lib/AuthenticatedUser";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import {
  productLinks,
  solutionLinks,
  resourceLinks,
  companyLinks,
} from "./links";
import type { FormattedUserData } from "@/shared/lib/auth/get-user-data";

interface MainHeaderClientProps {
  user: FormattedUserData | null;
}

/**
 * Client Component - получает данные о пользователе через пропсы
 * Нет loading состояния, нет race conditions, нет мигающего UI
 */
export function MainHeaderClient({ user }: MainHeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint like landing header
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isAuthenticated = !!user;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-background/95 backdrop-blur-md",
      )}
    >
      <div className="container-wide">
        <nav className="flex h-16 items-center px-4 mx-auto max-w-7xl">
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center  space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  Jc
                </span>
              </div>
              <span className=" text-xl font-bold gradient-text">
                Justio CRM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {" "}
                {/* Remove default gap between items */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium data-active:bg-transparent data-[state=open]:bg-transparent">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <ul className="grid w-125 gap-1 p-4 md:grid-cols-2">
                      {productLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          href={link.href}
                          title={link.title}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                      <li className="col-span-2 mt-2 border-t pt-2">
                        <Link
                          href="/product"
                          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                        >
                          View all features →
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium data-active:bg-transparent data-[state=open]:bg-transparent">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <ul className="grid w-100 gap-1 p-4">
                      {solutionLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          href={link.href}
                          title={link.title}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/pricing"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent focus:outline-none"
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/security"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent focus:outline-none"
                  >
                    Security
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium data-active:bg-transparent data-[state=open]:bg-transparent">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <ul className="grid w-75 gap-1 p-4">
                      {resourceLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          href={link.href}
                          title={link.title}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium data-active:bg-transparent data-[state=open]:bg-transparent">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <ul className="grid w-75 gap-1 p-4">
                      {companyLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          href={link.href}
                          title={link.title}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Auth and mobile menu */}
          <div className="flex items-center lg:justify-end lg:flex-1">
            {/* Desktop Auth Block */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {isAuthenticated ? (
                <AuthenticatedUser user={user} />
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={openAuthModal}>
                    Увійти
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90"
                    asChild
                  >
                    <Link href="/demo">Request demo</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <div className="lg:hidden mr-2">
                  <AuthenticatedUser user={user} showDashboardButton={false} />
                </div>
              )}
              <button
                className="lg:hidden p-2 -mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container-wide py-4 space-y-4 px-4">
              <div className="px-4">
                <MobileNavSection
                  title="Product"
                  links={productLinks}
                  onClose={() => setMobileMenuOpen(false)}
                />
                <MobileNavSection
                  title="Solutions"
                  links={solutionLinks}
                  onClose={() => setMobileMenuOpen(false)}
                />
                <Link
                  href="/pricing"
                  className="block py-2 text-sm font-medium text-foreground hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/security"
                  className="block py-2 text-sm font-medium text-foreground hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Security
                </Link>
                <MobileNavSection
                  title="Resources"
                  links={resourceLinks}
                  onClose={() => setMobileMenuOpen(false)}
                />
                <MobileNavSection
                  title="Company"
                  links={companyLinks}
                  onClose={() => setMobileMenuOpen(false)}
                />
              </div>

              {/* Mobile Auth Block */}
              <div className="px-4">
                {isAuthenticated ? (
                  <div
                    className="pt-4 space-y-2 animate-fade-in-up"
                    style={{ animationDelay: "200ms" }}
                  >
                    <Button asChild className="w-full">
                      <Link
                        href="/user/workspace"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Дашборд
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div
                    className="pt-4 space-y-2 animate-fade-in-up"
                    style={{ animationDelay: "200ms" }}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        openAuthModal();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Увійти
                    </Button>
                    <Button
                      className="w-full bg-accent hover:bg-accent/90"
                      asChild
                    >
                      <Link
                        href="/demo"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Request demo
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ListItem({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink
        href={href}
        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 focus:bg-accent/10"
      >
        <div className="text-sm font-medium leading-none text-foreground">
          {title}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
}

function MobileNavSection({
  title,
  links,
  onClose,
}: {
  title: string;
  links: { title: string; href: string; description: string }[];
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 py-2 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-1 text-sm text-muted-foreground hover:text-accent"
                  onClick={onClose}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
