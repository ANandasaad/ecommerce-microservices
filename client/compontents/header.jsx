import Link from "next/link";
import React from "react";

const Header = ({ user }) => {
  const links = [
    !user && {
      label: "Sign Up",
      href: "/auth/signup",
    },
    !user && {
      label: "Sign In",
      href: "/auth/signin",
    },
    user && { label: "Sell Tickets", href: "/tickets/new" },
    user && { label: "My Order", href: "/orders" },
    user && {
      label: "Sign Out",
      href: "/auth/signout",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <span className="nav-link">{label}</span>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">TikStore</Link>

      <div className="flex justify-end items-center">
        <ul className="flex gap-3">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
