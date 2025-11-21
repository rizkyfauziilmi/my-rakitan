"use client";

import { Facebook } from "@/components/svgs/facebook";
import { Instagram } from "@/components/svgs/instagram";
import { XformerlyTwitter } from "@/components/svgs/x-twitter";
import { YouTube } from "@/components/svgs/youtube";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { NavBar } from "./navbar";

export function Topbar() {
  return (
    <div>
      <TopBarBanner />
      <NavBar />
    </div>
  );
}

function TopBarBanner() {
  return (
    <div className="bg-[#252b42] text-white flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <Button variant="link" className="text-white">
          <Phone />
          0812-3456-7890
        </Button>
        <Button variant="link" className="text-white">
          <Mail />
          myrakitanid@gmail.com
        </Button>
      </div>

      <p>Ikuti Kami dan Dapatkan Diskon Hingga 80%!</p>

      <div className="flex items-center gap-1">
        <p>Ikuti Kami:</p>
        <Button variant="link" size="icon">
          <Instagram />
        </Button>
        <Button variant="link" size="icon">
          <YouTube />
        </Button>
        <Button variant="link" size="icon">
          <Facebook />
        </Button>
        <Button variant="link" size="icon">
          <XformerlyTwitter />
        </Button>
      </div>
    </div>
  );
}
